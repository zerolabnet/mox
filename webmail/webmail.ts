/* Javascript is generated from typescript, do not modify generated javascript because changes will be overwritten. */

/*
Webmail is a self-contained webmail client.

Typescript is used for type safety, but otherwise we try not to rely on any
JS/TS tools/frameworks etc, they often complicate/obscure how things work. The
DOM and styles are directly manipulated, so to develop on this code you need to
know about DOM functions. With a few helper functions in the dom object,
interaction with the DOM is still relatively high-level, but also allows for
more low-level techniques like rendering of text in a way that highlights text
that switches unicode blocks/scripts. We use typescript in strict mode, see
top-level tsc.sh. We often specify types for function parameters, but not
return types, since typescript is good at deriving return types.

There is no mechanism to automatically update a view when properties change. The
UI is split/isolated in components called "views", which expose only their root
HTMLElement for inclusion in another component or the top-level document. A view
has functions that other views (e.g. parents) can call for to propagate updates
or retrieve data. We have these views:

- Mailboxlist, in the bar on the list with all mailboxes.
- Mailbox, a single mailbox in the mailbox list.
- Search, with form for search criteria, opened through search bar.
- Msglist, the list of messages for the selected mailbox or search query.
- Msgitem, a message in Msglist, shown as a single line.
- Msg, showing the contents of a single selected message.
- Compose, when writing a new message (or reply/forward).

Most of the data is transferred over an SSE connection. It sends the initial
list of mailboxes, sends message summaries for the currently selected mailbox or
search query and sends changes as they happen, e.g. added/removed messages,
changed flags, etc. Operations that modify data are done through API calls. The
typescript API is generated from the Go types and functions. Displayed message
contents are also retrieved through an API call.

HTML messages are potentially dangerous. We display them in a separate iframe,
with contents served in a separate HTTP request, with Content-Security-Policy
headers that prevent executing scripts or loading potentially unwanted remote
resources. We cannot load the HTML in an inline iframe, because the iframe "csp"
attribute to set a Content-Security-Policy is not supported by all modern
browsers (safari and firefox don't support it at the time of writing). Text
messages are rendered inside the webmail client, making URLs clickable,
highlighting unicode script/block changes and rendering quoted text in a
different color.

Browsers to test with: Firefox, Chromium, Safari, Edge.

To simulate slow API calls and SSE events:

	localStorage.setItem('sherpats-debug', JSON.stringify({waitMinMsec: 2000, waitMaxMsec: 4000}))

Enable logging and reload afterwards:

	localStorage.setItem('log', 'yes')

Enable consistency checking in UI updates:

	settingsPut({...settings, checkConsistency: true})

- todo: in msglistView, show names of people we have sent to, and address otherwise. or at don't show names for first-time senders.
- todo: implement settings stored in the server, such as mailboxCollapsed, keyboard shortcuts. name to use for "From", optional default Reply-To and Bcc addresses, signatures (per address), configured labels/keywords with human-readable name, colors and toggling with shortcut keys 1-9.
- todo: automated tests? perhaps some unit tests, then ui scenario's.
- todo: composing of html messages. possibly based on contenteditable. would be good if we can include original html, but quoted. must make sure to not include dangerous scripts/resources, or sandbox it.
- todo: make alt up/down keys work on html iframe too. requires loading it from sameorigin, to get access to its inner document.
- todo: reconnect with last known modseq and don't clear the message list, only update it
- todo: for embedded messages (message/rfc822 or message/global), allow viewing it as message, perhaps in a popup?
- todo: only show orange underline where it could be a problem? in addresses and anchor texts. we may be lighting up a christmas tree now, desensitizing users.
- todo: saved searches that are displayed below list of mailboxes, for quick access to preset view
- todo: when search on free-form text is active, highlight the searched text in the message view.
- todo: forwarding of html parts, including inline attachments, so the html version can be rendered like the original by the receiver.
- todo: buttons/mechanism to operate on all messages in a mailbox/search query, without having to list and select all messages. e.g. clearing flags/labels.
- todo: can we detect if browser supports proper CSP? if not, refuse to load html messages?
- todo: more search criteria? Date header field (instead of time received), text vs html (only, either or both), attachment filenames and sizes
- todo: import messages into specific mailbox?
- todo: configurable keyboard shortcuts? we use strings like "ctrl p" which we already generate and match on, add a mapping from command name to cmd* functions, and have a map of keys to command names. the commands for up/down with shift/ctrl modifiers may need special attention.
- todo: consider composing messages with bcc headers that are sent as message Bcc headers to the bcc-addressees, optionally with checkbox.
- todo: improve accessibility
- todo: msglistView: preload next message?
- todo: previews of zip files
- todo: undo?
- todo: mobile-friendly version. should perhaps be a completely different app, because it is so different.
*/

import {dom, style, attr, prop, ElemArg} from '../lib'
import {css, ensureCSS, styles, styleClasses, equalAddress, formatAddress, formatAddressShort, formatEmail, loadMsgheaderView, isImage, renderText, formatDomain, join, applyTheme, themePreference} from './lib'
import {ui, chooseLang, langPreference, uiLocale, wroteLine, mailboxLabel, unreadTitle, selectedTitle} from './i18n'
import * as api from './api'
import * as icons from './icons'

// If we had to reload with a cache buster after a server update, the URL will
// start with ?v=.... Remove it and load again.
const reloadURL = URL.parse(window.location.href)
if (reloadURL?.search.startsWith('?v=')) {
	const l = reloadURL.search.split('&', 2)
	reloadURL.search = l.length === 2 ? '?'+l[1] : ''
	window.location.href = reloadURL.toString()
}

class ConsistencyError extends Error {
}

const zindexes = {
	splitter: '1',
	compose: '2',
	searchView: '3',
	searchbar: '4',
	popup: '10',
	popover: '9',
	attachments: '5',
	shortcut: '6',
	login: '7',
	mailboxesDrawer: '8',
	mobileHeader: '8',
}

const MOBILE_BP = 1280

// Layout viewport. The viewport meta in webmail.html makes Firefox responsive
// mode report this width, and resize still fires there. ResizeObserver covers a
// responsive-mode resize that changes the layout box without a window event.
const viewportWidth = (): number => document.documentElement.clientWidth

const isMobile = (): boolean => viewportWidth() <= MOBILE_BP

const updateMobileMode = (): void => {
	document.documentElement.classList.toggle('mobile', isMobile())
}

// Buttons and input elements.
ensureCSS('.button', {display: 'inline-block'})
ensureCSS('button, .button, select', {backgroundColor: styles.buttonBackground, border: '1px solid', borderColor: styles.buttonBorderColor, borderRadius: styles.radius, padding: '6px 12px', fontSize: '13px', cursor: 'pointer', transition: 'background .2s, border-color .2s, color .2s'})
ensureCSS('button, .button, select, a.button:visited', {color: styles.color})
ensureCSS('button.active, .button.active, button.active:hover, .button.active:hover', {backgroundColor: styles.accentSoft, borderColor: styles.accent, color: styles.accent})
ensureCSS('button:hover:not(:disabled), .button:hover:not(:disabled), select:hover:not(:disabled)', {backgroundColor: styles.buttonHoverBackground, borderColor: styles.accent, textDecoration: 'none'})
ensureCSS('button, .button', {textDecoration: 'none'})
ensureCSS('button:disabled, .button:disabled, select:disabled', {opacity: .5, cursor: 'default'})
ensureCSS('.btnPrimary, .btnPrimary:hover:not(:disabled)', {backgroundColor: styles.buttonPrimaryBackground, borderColor: styles.buttonPrimaryBackground, color: '#fff'})
ensureCSS('.btnPrimary:hover:not(:disabled)', {backgroundColor: styles.buttonPrimaryHover, borderColor: styles.buttonPrimaryHover})
ensureCSS('input, textarea', {backgroundColor: styles.backgroundColorMild, color: styles.color, border: '1px solid', borderColor: styles.borderStrong, borderRadius: styles.radius, padding: '8px 10px', fontSize: '13px', fontFamily: 'inherit', transition: 'border-color .2s, background .2s'})
ensureCSS('input:focus, textarea:focus, select:focus', {outline: 'none', borderColor: styles.accent, backgroundColor: styles.backgroundColorMild})
ensureCSS('input:hover:not(:disabled), textarea:hover:not(:disabled)', {borderColor: styles.accent})

ensureCSS('.btngroup', {display: 'inline-flex', alignItems: 'stretch', flexWrap: 'nowrap', verticalAlign: 'middle'})
ensureCSS('.btngroup button, .btngroup .button', {borderRadius: 0, borderRightWidth: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', margin: 0, boxSizing: 'border-box'})
ensureCSS('.btngroup button:first-child, .btngroup .button:first-child', {borderRadius: styles.radius + ' 0 0 ' + styles.radius})
ensureCSS('.btngroup button:last-child, .btngroup .button:last-child', {borderRadius: '0 ' + styles.radius + ' ' + styles.radius + ' 0', borderRightWidth: '1px'})
ensureCSS('.btngroup button:hover:not(:disabled), .btngroup .button:hover:not(:disabled), .btngroup button.active, .btngroup .button.active, .btngroup button.active:hover, .btngroup .button.active:hover', {position: 'relative', zIndex: 1})
ensureCSS('.btngroup button:not(:last-child):hover:not(:disabled), .btngroup .button:not(:last-child):hover:not(:disabled), .btngroup button.active:not(:last-child), .btngroup .button.active:not(:last-child), .btngroup button.active:not(:last-child):hover, .btngroup .button.active:not(:last-child):hover', {marginRight: '-1px', borderRightWidth: '1px'})

css('btnIcon', {minWidth: '26px', width: '26px', height: '26px', padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '14px'})
css('btnCompact', {padding: '2px 8px', lineHeight: 1.3, fontSize: '12px', height: 'auto'})
css('mailboxActionBtn', {padding: '0 6px', height: '26px', minHeight: '26px', minWidth: '26px', lineHeight: 1, fontSize: '12px', alignSelf: 'center', verticalAlign: 'middle', flexShrink: 0})

// Dark top navigation bar.
ensureCSS('.topBar', {display: 'flex', flexWrap: 'wrap', position: 'relative', zIndex: '6', backgroundColor: styles.mailboxesTopBackgroundColor, boxShadow: styles.shadowSm, color: styles.navTextColor})
ensureCSS('.topBarNav button, .topBarNav .button, .topBarNav select', {backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: styles.navTextColor})
ensureCSS('.topBarNav button:hover:not(:disabled), .topBarNav .button:hover:not(:disabled), .topBarNav select:hover:not(:disabled)', {backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.25)', color: styles.navTextHover})
ensureCSS('.topBarNav button.active, .topBarNav .button.active', {backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.3)', color: styles.navTextHover})
ensureCSS('.topBarSearchForm', {display: 'flex', alignItems: 'stretch', flexGrow: 1, gap: '4px'})
ensureCSS('.topBarSearchInput', {flex: 1, minWidth: 0, height: '34px', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', color: styles.navTextHover})
ensureCSS('.topBarSearchInput::placeholder', {color: styles.navTextColor})
ensureCSS('.topBarSearchInput:focus', {backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)'})
ensureCSS('.topBarSearchInput.searchbarActive', {backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(255,255,255,0.35)'})
ensureCSS('.topBarSearchClear', {width: '34px', minWidth: '34px', height: '34px', padding: 0, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)', color: styles.navTextColor})
ensureCSS('.topBarSearchClear:hover:not(:disabled)', {backgroundColor: 'rgba(255,255,255,0.14)', borderColor: 'rgba(255,255,255,0.25)', color: styles.navTextHover})
ensureCSS('.topBar .btnPrimary, .topBar .btnPrimary:hover:not(:disabled)', {backgroundColor: styles.buttonPrimaryBackground, borderColor: styles.buttonPrimaryBackground, color: '#fff'})
ensureCSS('.topBar .btnPrimary:hover:not(:disabled)', {backgroundColor: styles.buttonPrimaryHover, borderColor: styles.buttonPrimaryHover})
ensureCSS('.topBar a', {color: styles.navTextColor})
ensureCSS('.topBar a:hover', {color: styles.navTextHover})
ensureCSS('.topBarNav span, .topBar .status', {color: styles.navTextColor})

ensureCSS('.searchOverlay', {position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, zIndex: zindexes.compose, backgroundColor: styles.overlayBackgroundColor})
ensureCSS('.searchOverlay .searchContent', {position: 'fixed', left: 0, right: 0, bottom: 0, top: 'auto', width: '100%', maxWidth: 'none', maxHeight: 'min(90dvh, calc(100dvh - 3.5em))', zIndex: 1, color: styles.popupColor, backgroundColor: styles.popupBackgroundColor, border: '1px solid', borderColor: styles.floatBorderColor, borderRadius: '12px 12px 0 0', boxShadow: styles.floatShadow, boxSizing: 'border-box', padding: 0, overflow: 'hidden', display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr) auto'})
ensureCSS('html:not(.mobile) .searchOverlay .searchContent', {left: '50%', right: 'auto', transform: 'translateX(-50%)', width: 'min(50em, calc(100vw - 2em))'})
ensureCSS('.searchOverlay .searchContent .dialogBody', {padding: '16px'})
ensureCSS('.searchOverlay .searchContent .dialogFooter', {padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0))'})
ensureCSS('.searchContent, .searchContent .searchTable', {backgroundColor: styles.popupBackgroundColor})
ensureCSS('.searchContent label', {color: styles.color, fontWeight: 600, fontSize: '13px'})
ensureCSS('.searchTable tr', {display: 'block', marginBottom: '1em'})
ensureCSS('.searchTable td', {display: 'block', width: '100%', padding: '0', boxSizing: 'border-box'})
ensureCSS('.searchTable td:first-child', {width: 'auto', paddingBottom: '.35em', fontWeight: 600, fontSize: '12px', color: styles.colorMild, whiteSpace: 'normal'})
ensureCSS('.searchTable input, .searchTable select', {width: '100%', maxWidth: '100%', boxSizing: 'border-box'})
ensureCSS('.searchMailboxKids', {marginTop: '8px'})
ensureCSS('.searchMailboxKids label', {display: 'flex', alignItems: 'flex-start', gap: '10px', fontWeight: 400, fontSize: '13px', lineHeight: '1.4', textAlign: 'left'})
ensureCSS('.searchMailboxKids input[type=checkbox]', {width: 'auto', flexShrink: 0, marginTop: '3px'})
ensureCSS('.searchKeywordButtons', {display: 'flex', flexWrap: 'wrap', gap: '6px', lineHeight: 'normal', marginBottom: '8px'})
ensureCSS('.searchKeywordButtons button', {flex: '0 1 auto'})
ensureCSS('.searchTable .searchSizeRow', {display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'})
ensureCSS('.searchTable .searchSizeRow input', {flex: '1 1 8em', width: 'auto', minWidth: 0})
ensureCSS('.searchContent input, .searchContent select, .searchContent textarea', {boxSizing: 'border-box', backgroundColor: styles.backgroundColorMild, color: styles.color, border: '1px solid', borderColor: styles.borderStrong})
ensureCSS('.searchContent input:not([type=checkbox]):not([type=radio])', {minHeight: '38px', height: '38px'})
ensureCSS('.searchContent select', {minHeight: '38px', height: '38px'})
ensureCSS('.searchContent input:focus, .searchContent select:focus, .searchContent textarea:focus', {borderColor: styles.accent, backgroundColor: styles.backgroundColorMild, outline: 'none'})
ensureCSS('.searchContent .dialogBody button, .searchContent .dialogBody .button', {backgroundColor: styles.buttonBackground, borderColor: styles.buttonBorderColor, color: styles.color})
ensureCSS('.searchContent .dialogBody button:hover:not(:disabled), .searchContent .dialogBody .button:hover:not(:disabled)', {backgroundColor: styles.buttonHoverBackground, borderColor: styles.accent, color: styles.color})
ensureCSS('.searchContent .dialogBody button.active, .searchContent .dialogBody .button.active', {backgroundColor: styles.accentSoft, borderColor: styles.accent, color: styles.accent})
ensureCSS('.searchContent .btngroup', {flexWrap: 'wrap', gap: '6px'})
ensureCSS('.searchRadios', {display: 'flex', flexWrap: 'wrap', gap: '8px 12px'})
ensureCSS('.searchRadios label', {display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 400, whiteSpace: 'nowrap'})
ensureCSS('.searchDateRow', {display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'})
ensureCSS('.searchDateRow input[type=date]', {flex: '1 1 9em', minWidth: 0})
ensureCSS('.searchDateRow input[type=time]', {flex: '0 0 5.5em'})
ensureCSS('.searchDateRow > span', {color: styles.colorMild, padding: '0 2px'})
ensureCSS('.searchDateRow .btnIcon', {width: '38px', minWidth: '38px', height: '38px', minHeight: '38px', padding: 0, boxSizing: 'border-box'})
ensureCSS('.attachmentsDownloadHeader .button', {flexShrink: 0})

ensureCSS('.refineBar', {display: 'flex', alignItems: 'center', flexWrap: 'nowrap', gap: '6px', minWidth: 0, flex: '1 1 auto', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'thin'})
ensureCSS('.refineBar .refineTitle', {display: 'inline', margin: 0, whiteSpace: 'nowrap', position: 'sticky', left: 0, zIndex: 1, flexShrink: 0, backgroundColor: styles.backgroundColorMild})
ensureCSS('.refineBar .btngroup', {flexWrap: 'nowrap', flexShrink: 0})
ensureCSS('.msgListFilterSortingControls', {display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto', flexShrink: 0, minWidth: 0})
ensureCSS('.threadModeLabel', {color: styles.colorMild, whiteSpace: 'nowrap'})
ensureCSS('.msgListFilterSortingControls .threadModeSelect', {width: '6.6em', maxWidth: '6.6em'})
ensureCSS('.msgListFilterSortingControls > span:empty', {display: 'none'})
ensureCSS('.mailboxesRegion', {width: '100%', boxSizing: 'border-box', backgroundColor: styles.mailboxesSidebarBackground})
ensureCSS('.mailboxesBox > .pad', {padding: '14px 10px'})
ensureCSS('.mailboxesList', {display: 'flex', flexDirection: 'column', gap: '3px'})
ensureCSS('.mailboxesHeader', {display: 'flex', alignItems: 'center', width: '100%', boxSizing: 'border-box', marginBottom: 0, padding: '6px 6px 6px 8px'})
ensureCSS('.mailboxesHeader .mailboxesTitle', {margin: 0, flex: '1 1 auto', minWidth: 0})
ensureCSS('.mailboxesHeader .mailboxActionBtn', {marginLeft: 'auto', flexShrink: 0})
ensureCSS('.mailboxItem', {display: 'block', width: '100%', boxSizing: 'border-box', padding: '10px 12px', margin: 0, cursor: 'pointer', borderRadius: '8px', userSelect: 'none', color: styles.colorMild, fontWeight: '600', fontSize: '0.92rem', transition: 'background .15s, color .15s'})
ensureCSS('.mailboxItem svg', {width: '18px', height: '18px', flex: 'none', opacity: '.8'})
ensureCSS('.mailboxItem.active svg', {opacity: '1'})
ensureCSS('.mailboxIcon', {display: 'inline-flex', flex: 'none', alignItems: 'center'})
ensureCSS('.mailbox', {display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 0, flex: 1, minWidth: 0, width: '100%', boxSizing: 'border-box', gap: '11px'})
ensureCSS('.mailboxName', {flex: '1 1 auto', minWidth: 0, paddingRight: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: 'inherit'})
ensureCSS('.mailboxActions', {display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto', paddingRight: '2px'})
ensureCSS('.mailboxUnreadBadge', {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', padding: '0 6px', borderRadius: '9px', fontSize: '11px', fontWeight: 600, lineHeight: 1, flexShrink: 0, boxSizing: 'border-box', backgroundColor: styles.buttonPrimaryBackground, color: '#fff'})
ensureCSS('.mailboxUnreadBadge.isEmpty', {display: 'none'})
ensureCSS('.mailboxItem.active .mailboxUnreadBadge', {backgroundColor: styles.buttonPrimaryBackground, color: '#fff'})
ensureCSS('.topBarComposeDesktop', {display: 'flex', justifyContent: 'center', alignItems: 'center', boxSizing: 'border-box', padding: '.45em .5em', flex: 'none'})
ensureCSS('.topBarComposeDesktop .btnPrimary', {width: '100%', boxSizing: 'border-box', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px'})
ensureCSS('.mailboxItem.active .mailboxActionBtn', {backgroundColor: 'transparent', borderColor: styles.accent})
ensureCSS('.msgItem', {display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'flex-start', position: 'relative', width: '100%', boxSizing: 'border-box', userSelect: 'none', cursor: 'pointer', border: '1px solid transparent', borderLeft: '3px solid transparent', borderBottom: '1px solid', borderBottomColor: styles.borderColor, borderRadius: 0, margin: 0, transition: 'background .15s, border-color .15s'})
ensureCSS('.msgItem .scriptswitch', {textDecoration: 'none'})
ensureCSS('.msgItemCell', {padding: '4px 6px', boxSizing: 'border-box'})
ensureCSS('.msgItemFlags', {flex: '0 0 auto', flexShrink: 0, boxSizing: 'border-box', overflow: 'hidden'})
ensureCSS('.msgThreadToggle', {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box', minWidth: '22px', height: '22px', padding: '0 5px', lineHeight: '1', fontSize: '12px', fontWeight: '600', flexShrink: '0'})
ensureCSS('.msgThreadToggle svg', {width: '14px', height: '14px', display: 'block'})
ensureCSS('.msgItemAge', {flex: '0 0 auto', flexShrink: 0, boxSizing: 'border-box', whiteSpace: 'nowrap', overflow: 'hidden'})
ensureCSS('.msgItemMain', {display: 'flex', flexDirection: 'column', gap: '1px', overflow: 'hidden', position: 'relative', minWidth: 0, flex: '1 1 auto'})
ensureCSS('.msgItemFromRow', {display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', minWidth: 0})
ensureCSS('.msgItemSubjectRow', {display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px', minWidth: 0})
ensureCSS('.msgItemPreviewRow', {minWidth: 0})
ensureCSS('.msgItemFromText', {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flex: 1})
ensureCSS('.msgItemSubjectText', {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px', color: styles.colorMild, minWidth: 0, flex: 1})
ensureCSS('.msgItemPreviewText', {whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '11px', color: styles.colorMilder, minWidth: 0})
ensureCSS('.msgItemUnread .msgItemFromText', {fontWeight: 'bold', color: styles.color})
ensureCSS('.msgItemUnread .msgItemSubjectText', {color: styles.color})
ensureCSS('.inlineAttachmentsLine', {display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.5em'})
ensureCSS('.msgModeBar', {display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'})

const keywordButtonStyle = css('keywordButton', {cursor: 'pointer'})
ensureCSS('.keywordButton:hover:not(:disabled)', {backgroundColor: styles.highlightBackgroundHover})

// Mobile layout (html.mobile set by updateMobileMode).
ensureCSS('.topBarStatusRow', {display: 'flex', flexGrow: 1, alignItems: 'center', minWidth: 0})
ensureCSS('.topBarSearchRow', {display: 'flex', alignItems: 'center', gap: '6px', flex: '1 1 auto', minWidth: 0})
ensureCSS('html:not(.mobile) .topBar', {flexWrap: 'nowrap', alignItems: 'center'})
ensureCSS('html:not(.mobile) .topBarStatusRow', {flexGrow: 0, flexShrink: 0, minWidth: 0, justifyContent: 'flex-end'})
ensureCSS('html:not(.mobile) .topBarStatusRow .status', {flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'})
ensureCSS('html:not(.mobile) .topBarNav', {display: 'flex', flexWrap: 'nowrap', flexShrink: 0, gap: '6px', justifyContent: 'flex-end', alignItems: 'center', paddingLeft: '1em'})
ensureCSS('.theme-toggle-container', {display: 'flex', alignItems: 'center', alignSelf: 'center', gap: 0, flex: 'none', flexShrink: 0})
ensureCSS('html:not(.mobile) .theme-toggle-container', {marginLeft: '10px', paddingLeft: '14px', borderLeft: '1px solid rgba(255,255,255,.15)'})
ensureCSS('html.mobile .theme-toggle-container', {marginLeft: 'auto', paddingLeft: 0, borderLeft: 0})
ensureCSS('.theme-toggle', {position: 'relative', display: 'inline-block', width: '3.26rem', height: '1.61rem', flex: 'none', cursor: 'pointer'})
ensureCSS('.theme-toggle input', {position: 'absolute', opacity: 0, width: 0, height: 0, minHeight: 0, margin: 0, padding: 0, border: 0})
ensureCSS('.theme-toggle .slider', {position: 'absolute', cursor: 'pointer', inset: 0, background: 'rgba(255,255,255,.16)', borderRadius: '999px', transition: 'background .25s'})
ensureCSS('.theme-toggle .slider::before', {content: '""', position: 'absolute', width: '1.25rem', height: '1.25rem', left: '.18rem', top: '.18rem', background: '#fff', borderRadius: '50%', transition: 'transform .25s', zIndex: 1})
ensureCSS('.theme-toggle input:checked + .slider::before', {transform: 'translateX(1.65rem)'})
ensureCSS('.theme-toggle input:focus-visible + .slider', {outline: '2px solid #fff', outlineOffset: '2px'})
ensureCSS('.theme-slot', {position: 'absolute', top: '.18rem', width: '1.25rem', height: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.72)', pointerEvents: 'none', zIndex: 2})
ensureCSS('.theme-sun', {left: '.18rem'})
ensureCSS('.theme-moon', {right: '.18rem'})
ensureCSS('.theme-slot .icon', {width: '.78rem', height: '.78rem'})
ensureCSS('.theme-toggle input:not(:checked) + .slider .theme-sun, .theme-toggle input:checked + .slider .theme-moon', {color: '#1c2430'})
ensureCSS('.theme-toggle-container button.theme-auto, .theme-toggle-container button.theme-auto:hover, .theme-toggle-container button.theme-auto:hover:not(:disabled), .theme-toggle-container button.theme-auto.active, .theme-toggle-container button.theme-auto.active:hover', {display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.61rem', minWidth: '1.61rem', height: '1.61rem', minHeight: '1.61rem', padding: 0, border: 0, borderRadius: '999px', backgroundColor: 'transparent', boxShadow: 'none', color: 'rgba(255,255,255,.45)', cursor: 'pointer', lineHeight: 1})
ensureCSS('.theme-toggle-container button.theme-auto:hover, .theme-toggle-container button.theme-auto:hover:not(:disabled), .theme-toggle-container button.theme-auto.active, .theme-toggle-container button.theme-auto.active:hover', {color: '#fff', backgroundColor: 'transparent', borderColor: 'transparent'})
ensureCSS('.theme-auto .icon', {width: '.95rem', height: '.95rem'})
ensureCSS('.theme-auto:focus-visible', {outline: '2px solid #fff', outlineOffset: '2px'})
ensureCSS('.theme-toggle-container button.lang-choice, .theme-toggle-container button.lang-choice:hover, .theme-toggle-container button.lang-choice:hover:not(:disabled)', {display: 'flex', alignItems: 'center', justifyContent: 'center', width: '1.61rem', minWidth: '1.61rem', height: '1.61rem', minHeight: '1.61rem', padding: 0, border: 0, borderRadius: '999px', backgroundColor: 'transparent', boxShadow: 'none', color: 'rgba(255,255,255,.45)', cursor: 'pointer', lineHeight: 1})
ensureCSS('.theme-toggle-container button.lang-choice:hover, .theme-toggle-container button.lang-choice:hover:not(:disabled)', {color: '#fff', backgroundColor: 'transparent', borderColor: 'transparent'})
ensureCSS('.theme-toggle-container .lang-choice .icon', {width: '.95rem', height: '.95rem'})
ensureCSS('.theme-toggle-container .lang-choice:focus-visible', {outline: '2px solid #fff', outlineOffset: '2px'})
ensureCSS('.theme-switch-group', {display: 'flex', alignItems: 'center', gap: '.45rem', marginLeft: '14px', paddingLeft: '14px', borderLeft: '1px solid rgba(255,255,255,.15)'})
ensureCSS('.nav-account', {position: 'relative'})
ensureCSS('.nav-account button.nav-account-toggle, .nav-account button.nav-account-toggle:hover:not(:disabled)', {display: 'inline-flex', alignItems: 'center', gap: '.5rem', padding: '8px 12px', border: 0, borderRadius: '8px', backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit', cursor: 'pointer'})
ensureCSS('.nav-account button.nav-account-toggle:hover:not(:disabled)', {backgroundColor: 'rgba(255,255,255,.08)', color: '#fff'})
ensureCSS('.nav-account-label', {maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'})
ensureCSS('.nav-account .icon', {width: '1.15em', height: '1.15em', flex: 'none'})
ensureCSS('.nav-account .icon.nav-account-caret', {width: '1em', height: '1em', opacity: '.7'})
ensureCSS('.nav-account-menu', {display: 'none', flexDirection: 'column', position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: '30', width: 'max-content', padding: '6px 0', backgroundColor: '#353a40', color: 'inherit', border: '1px solid rgba(255,255,255,.12)', borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,.28)'})
ensureCSS('.nav-account.open .nav-account-menu', {display: 'flex'})
ensureCSS('.nav-account button.nav-account-item, .nav-account button.nav-account-item:hover:not(:disabled), a.nav-account-item, a.nav-account-item:hover:not(:disabled)', {display: 'flex', alignItems: 'center', alignSelf: 'stretch', gap: '10px', width: 'auto', boxSizing: 'border-box', textAlign: 'left', textDecoration: 'none', whiteSpace: 'nowrap', padding: '9px 14px', border: 0, borderRadius: 0, backgroundColor: 'transparent', boxShadow: 'none', color: 'inherit', fontSize: '13px', cursor: 'pointer'})
ensureCSS('.nav-account button.nav-account-item:hover:not(:disabled), a.nav-account-item:hover:not(:disabled)', {backgroundColor: 'rgba(255,255,255,.08)', color: '#fff'})
ensureCSS('.nav-account-item[hidden]', {display: 'none'})
ensureCSS('.nav-account-divider', {height: '1px', margin: '6px 0', backgroundColor: 'rgba(255,255,255,.12)'})
ensureCSS('.nav-account-layouts', {display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px 14px'})
ensureCSS('.nav-account button.nav-layout, .nav-account button.nav-layout:hover:not(:disabled)', {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', padding: 0, border: 0, borderRadius: '8px', backgroundColor: 'transparent', boxShadow: 'none', color: 'rgba(255,255,255,.45)', cursor: 'pointer'})
ensureCSS('.nav-account button.nav-layout:hover:not(:disabled)', {color: '#fff', backgroundColor: 'rgba(255,255,255,.08)'})
ensureCSS('.nav-account button.nav-layout.isOn, .nav-account button.nav-layout.isOn:hover:not(:disabled)', {color: '#fff', backgroundColor: 'rgba(255,255,255,.16)'})
ensureCSS('.nav-account button.nav-layout .icon', {width: '1.15em', height: '1.15em'})
ensureCSS('.msgActionRow', {display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', padding: '.45em .65em'})
ensureCSS('.msgActionRow button', {flex: '0 1 auto'})
ensureCSS('.msgListActionBar', {display: 'none', flexWrap: 'wrap', gap: '8px', alignItems: 'center', padding: '.45em .65em', borderBottom: '1px solid', borderBottomColor: styles.borderColor, backgroundColor: styles.backgroundColorMild})
ensureCSS('.msgListActionBar.isOpen', {display: 'flex'})
ensureCSS('.msgItemFlagBtn, .msgItemFlagBtn:hover:not(:disabled)', {flexShrink: '0', padding: '2px', lineHeight: '1', minWidth: '22px', backgroundColor: 'transparent', borderColor: 'transparent', boxShadow: 'none', color: styles.colorMild})
ensureCSS('.msgItemFlagBtn.isOn, .msgItemFlagBtn.isOn:hover:not(:disabled)', {backgroundColor: 'transparent', borderColor: 'transparent', color: ['#d1242f', '#ff5c5c']})
ensureCSS('.msgItemFlagBtn.isOn .msgItemFlagCloth', {fill: 'currentColor'})
ensureCSS('.msgItemHoverActions', {display: 'none', position: 'absolute', right: '6px', top: '6px', gap: '4px', zIndex: '1', padding: '4px', backgroundColor: ['inherit', styles.popupBackgroundColor], border: '1px solid', borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow})
ensureCSS('html:not(.mobile) .msgItem:hover .msgItemHoverActions', {display: 'flex'})
ensureCSS('.msgItemHoverActions button', {padding: '2px 8px', lineHeight: '1.3', fontSize: '12px'})
ensureCSS('.msgItemHoverActions button.msgItemHoverIcon', {width: '28px', minWidth: '28px', height: '28px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: 0, boxShadow: 'none', lineHeight: 1, color: 'inherit'})
ensureCSS('.msgItemHoverActions button.msgItemHoverIcon:hover:not(:disabled)', {backgroundColor: 'transparent', borderColor: 'transparent', color: styles.accent})
ensureCSS('.msgItemHoverActions button.msgItemHoverIcon.msgItemHoverDanger, .msgItemHoverActions button.msgItemHoverIcon.msgItemHoverDanger:hover:not(:disabled)', {backgroundColor: 'transparent', borderColor: 'transparent', color: ['#d1242f', '#ff5c5c']})
ensureCSS('.msgFromName', {fontSize: '16px', fontWeight: '600', lineHeight: '1.3'})
ensureCSS('.msgFromDetail', {fontSize: '12px', color: styles.colorMild})
ensureCSS('.moveUndoBar', {position: 'absolute', right: '12px', bottom: '12px', zIndex: zindexes.popup, display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: styles.popupBackgroundColor, color: styles.popupColor, border: '1px solid', borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow, maxWidth: 'calc(100% - 24px)'})
ensureCSS('.moveUndoBarFloating', {position: 'fixed', right: '12px', bottom: 'max(12px, env(safe-area-inset-bottom))'})
ensureCSS('.topBarMessageRow', {display: 'none', alignItems: 'center', gap: '6px', flex: '1 1 100%', minWidth: 0})
ensureCSS('.topBarMobileOverflow', {minWidth: '44px', minHeight: '44px', padding: '0 10px', flexShrink: 0})
ensureCSS('.topBarMobileOnly', {display: 'none'})
ensureCSS('.mailboxesBackdrop', {display: 'none'})
ensureCSS('.mobileMsgHeader', {display: 'none'})
ensureCSS('.mobileMsgPane', {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0})

ensureCSS('html.mobile .topBar', {flexWrap: 'nowrap', alignItems: 'stretch', paddingTop: 'env(safe-area-inset-top, 0)'})
ensureCSS('html.mobile .topBar > .pad', {padding: '.4em .5em', boxSizing: 'border-box'})
ensureCSS('html.mobile .topBarSearchRow, html.mobile.mobile-pane-message .topBarMessageRow', {flex: '1 1 100%', width: '100%', maxWidth: '100%'})
ensureCSS('html.mobile.mobile-pane-list .topBarMessageRow', {display: 'none'})
ensureCSS('html.mobile .mailboxesListMsgBox', {backgroundColor: styles.backgroundColorMild})
ensureCSS('html.mobile .topBarComposeDesktop', {display: 'none'})
ensureCSS('html.mobile .topBarMobileOnly', {display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0})
ensureCSS('html.mobile .topBarNavDesktop', {display: 'none'})
ensureCSS('html.mobile .topBarStatusRow', {display: 'none'})
ensureCSS('html.mobile .topBarSearchRow', {flex: '1 1 auto', minWidth: 0})
ensureCSS('html.mobile.mobile-pane-message .topBarSearchRow', {display: 'none'})
ensureCSS('html.mobile.mobile-pane-message .topBarMessageRow', {display: 'flex'})
ensureCSS('html.mobile .topBarMessageTitle', {flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '600', color: styles.navTextHover})
ensureCSS('html.mobile .topBarSearchForm', {flex: 1, minWidth: 0})
ensureCSS('html.mobile .searchbarBox', {flex: '1 1 0', minWidth: 0, display: 'flex'})
ensureCSS('html.mobile .searchbarBox search', {display: 'flex', flex: '1 1 0', minWidth: 0, width: '100%'})
ensureCSS('html.mobile .topBarSearchInput', {flex: 1, minWidth: 0, width: '100%', height: '38px'})
ensureCSS('html.mobile .topBarSearchClear', {width: '38px', minWidth: '38px', height: '38px'})
ensureCSS('html.mobile .topBarMenuBtn', {minWidth: '40px', minHeight: '40px', padding: '0', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'})
ensureCSS('.topBarMenuIcon', {display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', flexShrink: 0})
ensureCSS('.searchDatePresets', {display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px'})
ensureCSS('html.mobile .topBarMobileCompose, html.mobile .topBarMessageBack, html.mobile .topBarMobileOverflow', {minWidth: '40px', minHeight: '40px', padding: '0 8px', flexShrink: 0, fontSize: '20px', lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center'})
ensureCSS('html.mobile .topBarMessageTitle, html.mobile .topBarMessageTitle .scriptswitch', {textDecoration: 'none'})
ensureCSS('html.mobile .mailboxesSidebar', {position: 'fixed', left: 0, top: 0, bottom: 0, width: 'min(280px, 85vw)', maxWidth: '85vw', zIndex: zindexes.mailboxesDrawer, transform: 'translateX(-100%)', transition: 'transform .2s ease', boxShadow: styles.boxShadow, visibility: 'visible'})
ensureCSS('html.mobile.mailboxes-drawer-open .mailboxesSidebar', {transform: 'translateX(0)'})
ensureCSS('html.mobile .mailboxesBackdrop', {display: 'none', position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, zIndex: '7', backgroundColor: styles.overlayBackgroundColor})
ensureCSS('html.mobile.mailboxes-drawer-open .mailboxesBackdrop', {display: 'block'})
ensureCSS('html.mobile .mailboxessplitElem, html.mobile .mailboxesListGrab', {display: 'none'})
ensureCSS('html.mobile .listMsgBox', {left: '0', right: '0'})
ensureCSS('html.mobile .listMsgLeftRightGrab, html.mobile .listMsgTopBottomGrab', {display: 'none'})
ensureCSS('html.mobile .msgItemFlagsOffset, html.mobile .msgItemMainOffset', {display: 'none'})
ensureCSS('html.mobile.mobile-pane-list .layoutRight, html.mobile.mobile-pane-list .layoutBottom', {display: 'none'})
ensureCSS('html.mobile.mobile-pane-list .layoutLeft, html.mobile.mobile-pane-list .layoutTop', {left: '0', right: '0', width: 'auto', height: 'auto', bottom: '0', top: '0'})
ensureCSS('html.mobile.mobile-pane-message .layoutLeft, html.mobile.mobile-pane-message .layoutTop', {display: 'none'})
ensureCSS('html.mobile.mobile-pane-message .layoutRight, html.mobile.mobile-pane-message .layoutBottom', {left: '0', right: '0', top: '0', bottom: '0', width: 'auto', height: 'auto'})
ensureCSS('html.mobile .mobileMsgPane', {display: 'flex', flexDirection: 'column', position: 'absolute', left: 0, right: 0, top: 0, bottom: 0})
ensureCSS('html.mobile .mobileMsgPane .msgElem', {position: 'relative', flex: '1 1 auto', minHeight: 0, borderLeftWidth: 0, display: 'flex', flexDirection: 'column'})
ensureCSS('html.mobile .msgViewRoot', {position: 'relative', flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column'})
ensureCSS('html.mobile .msgmeta', {maxHeight: 'none', flexShrink: 0, overflowY: 'visible', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .scrollparent', {flex: '1 1 auto', minHeight: 0})
ensureCSS('html.mobile .msgListFilterSorting', {padding: '.5em .65em'})
ensureCSS('html.mobile .refineBar', {flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: '6px'})
ensureCSS('html.mobile .refineBar .btngroup', {flexWrap: 'nowrap', flexShrink: 0})
ensureCSS('html.mobile .refineBar .btngroup button', {minHeight: '36px', padding: '6px 10px'})
ensureCSS('html.mobile .msgListFilterSortingControls', {marginLeft: 'auto', flexShrink: 0})
ensureCSS('html.mobile .msgListFilterSortingControls select, html.mobile .msgListFilterSortingControls button', {minHeight: '36px', padding: '6px 10px', boxSizing: 'border-box', fontSize: '13px'})
ensureCSS('html.mobile .msgListFilterSortingControls .threadModeSelect', {width: '6.6em', minWidth: 0, maxWidth: '6.6em'})
ensureCSS('html.mobile .msgListFilterSortingControls .threadSortBtn', {minWidth: '36px', padding: '6px 8px'})
ensureCSS('html.mobile .msgItemCell', {padding: '8px 6px', minHeight: '44px'})
ensureCSS('html.mobile .msgItemAge', {overflow: 'visible', paddingRight: '2px'})
ensureCSS('.msgMobileSummary', {display: 'none'})
ensureCSS('.msgMobileSummaryTop', {display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px'})
ensureCSS('.msgMobileSummaryFrom', {flex: '1 1 auto', minWidth: 0, fontWeight: '600', fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'})
ensureCSS('.msgMobileSummaryDate', {flexShrink: 0, fontSize: '12px', color: styles.colorMild, whiteSpace: 'nowrap'})
ensureCSS('.msgMobileSummaryMeta', {display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', minWidth: 0})
ensureCSS('.msgMobileSummaryTo', {flex: '1 1 auto', minWidth: 0, fontSize: '12px', color: styles.colorMild, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'})
ensureCSS('.msgMobileDetailsToggle', {flexShrink: 0, padding: '2px 6px', fontSize: '12px', lineHeight: 1.3, minHeight: 'auto', color: styles.accent})
ensureCSS('.msgMobileSummaryChips', {display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px'})
ensureCSS('.msgMobileSummaryChip', {fontSize: '10px', padding: '1px 5px', borderRadius: '3px', backgroundColor: styles.accentSoft, color: styles.colorMild})
ensureCSS('button.msgMobileSummaryChip', {border: 'none', minHeight: 'auto', lineHeight: 1.4, cursor: 'pointer'})
ensureCSS('button.msgMobileSummaryChip:hover:not(:disabled)', {backgroundColor: styles.highlightBackground})
ensureCSS('html.mobile .msgbuttonMobile', {padding: '6px 10px', borderBottom: '1px solid', borderBottomColor: styles.borderColor, flexShrink: 0})
ensureCSS('html.mobile .msgbuttonMobile .msgActionRow', {flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: '6px', padding: 0})
ensureCSS('html.mobile .msgbuttonMobile .msgActionRow button', {flexShrink: 0, minHeight: '32px', padding: '5px 12px', fontSize: '13px'})
ensureCSS('.menuList', {backgroundColor: styles.popupBackgroundColor, border: '1px solid', borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow, overflow: 'hidden', minWidth: '12em', color: styles.popupColor})
ensureCSS('.menuList.menuListFit', {display: 'inline-grid', minWidth: 0, width: 'max-content', verticalAlign: 'top'})
ensureCSS('.menuList.menuListFit .menuItem', {display: 'grid'})
ensureCSS('.menuList.menuListFit .menuItem button', {width: 'auto', justifySelf: 'stretch', whiteSpace: 'nowrap', boxSizing: 'border-box'})
ensureCSS('.menuItem', {borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('.menuItem:last-child', {borderBottom: 'none'})
ensureCSS('.menuItem button', {display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'left', border: 'none', borderRadius: 0, backgroundColor: 'transparent', padding: '10px 14px', minHeight: '40px', fontSize: '13px', color: styles.color})
ensureCSS('.menuItem button:hover:not(:disabled)', {backgroundColor: styles.buttonHoverBackground})
ensureCSS('.menuList.langMenu', {padding: '4px', minWidth: '168px'})
ensureCSS('.menuList.langMenu .menuItem', {borderBottom: 'none'})
ensureCSS('.menuList.langMenu .menuItem button', {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%', minHeight: '36px', margin: 0, padding: '0 10px', border: 0, borderRadius: styles.radius, backgroundColor: 'transparent', fontSize: '.875rem', textAlign: 'start'})
ensureCSS('.menuList.langMenu .menuItem button:hover:not(:disabled), .menuList.langMenu .menuItem button:focus-visible', {backgroundColor: styles.accentSoft, color: styles.color})
ensureCSS('.menuList.langMenu .menuItem button[aria-current="true"]', {fontWeight: '600'})
ensureCSS('.menuList.langMenu .menuItem button[aria-current="true"]::after', {content: '""', width: '5px', height: '9px', marginTop: '-2px', flex: 'none', borderStyle: 'solid', borderColor: styles.accent, borderWidth: '0 2px 2px 0', transform: 'rotate(45deg)'})
ensureCSS('.menuList.langMenu .langRule', {height: '1px', margin: '4px 6px', backgroundColor: styles.borderColor})
ensureCSS('.menuItem button.active, .menuItem button.active:hover:not(:disabled)', {display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: styles.accentSoft, color: styles.accent})
ensureCSS('.menuItem button .icon', {width: '1em', height: '1em', flex: 'none'})
ensureCSS('.menuItem > label', {display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box', padding: '10px 14px', fontWeight: 400, cursor: 'pointer'})
ensureCSS('.menuItemForm', {padding: '10px 14px'})

ensureCSS('.popupContent', {padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0, backgroundColor: styles.popupBackgroundColor, boxShadow: styles.floatShadow, border: '1px solid', borderColor: styles.floatBorderColor, borderRadius: styles.radius, maxWidth: '95vw', maxHeight: 'min(90dvh, calc(100dvh - 2em))', boxSizing: 'border-box'})
ensureCSS('.popupOverlay > .popupContent', {minHeight: 0, flexShrink: 0, margin: 'auto'})
ensureCSS('.popupContent > .dialogPanel, .popupContent > .dialogForm.dialogPanel', {flex: '1 1 auto', minHeight: 0, maxHeight: '100%', overflow: 'hidden'})
ensureCSS('.dialogPanel', {display: 'grid', gridTemplateRows: 'auto minmax(0, 1fr) auto', overflow: 'hidden', width: 'min(50em, calc(100vw - 2em))', minWidth: '0', maxWidth: '100%', maxHeight: 'min(90dvh, calc(100dvh - 2em))', boxSizing: 'border-box', backgroundColor: styles.popupBackgroundColor})
ensureCSS('.dialogForm', {margin: 0, padding: 0, border: 'none'})
ensureCSS('.helpPanel', {width: 'min(84em, calc(100vw - 2em))', minWidth: '0', maxWidth: '100%'})
ensureCSS('.helpColumns', {display: 'flex', flexWrap: 'wrap', gap: '1.5em', alignItems: 'flex-start', minWidth: 0})
ensureCSS('.helpColumns > div', {flex: '1 1 22em', minWidth: 'min(100%, 22em)', maxWidth: '100%', boxSizing: 'border-box'})
ensureCSS('.helpPanel table', {width: '100%', borderCollapse: 'collapse'})
ensureCSS('.helpPanel h2', {margin: '0 0 .5em 0', fontSize: '1rem', fontWeight: 600})
ensureCSS('.helpPanel td', {padding: '.2em .5em .2em 0', verticalAlign: 'top'})
ensureCSS('.helpPanel td:first-child', {whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: '12px', color: styles.colorMild})
ensureCSS('.internalsPanel', {width: 'min(90em, calc(100vw - 2em))', minWidth: 'min(32em, calc(100vw - 2em))'})
ensureCSS('.internalsColumns', {display: 'flex', flexWrap: 'wrap', gap: '1.25em', alignItems: 'flex-start'})
ensureCSS('.internalsColumns > div', {flex: '1 1 18em', minWidth: 'min(100%, 18em)'})
ensureCSS('.internalsColumns h2', {margin: '0 0 .5em 0', fontSize: '1rem', fontWeight: 600})
ensureCSS('.internalsList', {listStyle: 'disc', margin: '0 0 0 1em', padding: 0})
ensureCSS('.internalsPre', {whiteSpace: 'pre-wrap', tabSize: 4, fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.45, backgroundColor: styles.backgroundColorMild, padding: '12px', borderRadius: styles.radius, border: '1px solid', borderColor: styles.borderColor, overflowX: 'auto', margin: 0})
ensureCSS('.errorPanel', {width: 'min(60em, calc(100vw - 2em))', minWidth: 'min(32em, calc(100vw - 2em))'})
ensureCSS('.errorPre', {whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '12px', lineHeight: 1.45, backgroundColor: styles.backgroundColorMild, padding: '12px', borderRadius: styles.radius, border: '1px solid', borderColor: styles.borderColor, overflowX: 'auto', margin: '0 0 1em 0'})
ensureCSS('.errorPanel p', {margin: '0 0 .75em 0', lineHeight: 1.45})
ensureCSS('.dialogHeader', {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '14px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor, gridRow: '1', minWidth: 0, flexShrink: 0})
ensureCSS('.dialogHeader h1', {margin: 0, fontSize: '1.1rem', fontWeight: 600, color: styles.color, flex: '1 1 auto', minWidth: 0, lineHeight: 1.3})
ensureCSS('.dialogHeader .btnIcon', {flexShrink: 0})
ensureCSS('.dialogBody', {gridRow: '2', padding: '16px', overflowY: 'auto', overflowX: 'hidden', WebkitOverflowScrolling: 'touch', minHeight: 0, maxHeight: '100%'})
ensureCSS('.dialogBody > fieldset', {display: 'flex', flexDirection: 'column', gap: '14px', border: 'none', margin: 0, padding: 0, minWidth: 0})
ensureCSS('.dialogField', {display: 'flex', flexDirection: 'column', gap: '6px'})
ensureCSS('.dialogFieldLabel', {fontSize: '12px', fontWeight: 600, color: styles.colorMild})
ensureCSS('.dialogFieldHint', {fontSize: '12px', color: styles.colorMilder, fontStyle: 'italic', lineHeight: 1.4, margin: 0})
ensureCSS('.dialogField input:not([type=checkbox]):not([type=radio]), .dialogField select, .dialogField textarea', {width: '100%', boxSizing: 'border-box'})
ensureCSS('.dialogField textarea', {minHeight: '5em', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5})
ensureCSS('.dialogField select', {minHeight: '34px'})
ensureCSS('.dialogCheckField', {display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13px', lineHeight: 1.4, fontWeight: 400, color: styles.color, cursor: 'pointer'})
ensureCSS('.dialogCheckField input[type=checkbox]', {width: 'auto', flexShrink: 0, marginTop: '3px'})
ensureCSS('.dialogSection', {paddingTop: '12px', borderTop: '1px solid', borderTopColor: styles.borderColor, display: 'flex', flexDirection: 'column', gap: '10px'})
ensureCSS('.dialogSectionTitle', {fontSize: '12px', fontWeight: 600, color: styles.colorMild, textTransform: 'uppercase', letterSpacing: '.04em'})
ensureCSS('.dialogSectionText', {fontSize: '13px', lineHeight: 1.45, color: styles.color, margin: 0})
ensureCSS('.dialogActions', {display: 'flex', flexWrap: 'wrap', gap: '8px'})
ensureCSS('.dialogActionsStack', {display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px'})
ensureCSS('.dialogActionsStack button', {width: '100%', textAlign: 'left', boxSizing: 'border-box'})
ensureCSS('.confirmPanel p', {margin: '0', lineHeight: 1.45, maxWidth: '36em'})
ensureCSS('.dialogFooter', {gridRow: '3', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: '1px solid', borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, flexShrink: 0})
ensureCSS('.dialogFooter button', {minWidth: '6em', padding: '8px 20px', boxSizing: 'border-box'})
ensureCSS('.dialogFooter .btnPrimary, .dialogFooter button[type=submit]', {fontWeight: 600})
ensureCSS('html:not(.mobile) .popupOverlay', {padding: '1em', boxSizing: 'border-box', overflowY: 'auto', alignItems: 'flex-start'})
ensureCSS('html.mobile .popupOverlay', {alignItems: 'flex-end', padding: 0, overflowY: 'hidden'})
ensureCSS('html.mobile .popupContent', {width: '100%', maxWidth: '100%', borderRadius: '12px 12px 0 0', maxHeight: 'min(90dvh, calc(100dvh - 2em))'})
ensureCSS('html.mobile .dialogPanel', {width: '100%', minWidth: '0', maxHeight: 'min(90dvh, calc(100dvh - 2em))'})
ensureCSS('html.mobile .helpPanel, html.mobile .internalsPanel, html.mobile .errorPanel', {width: '100%'})
ensureCSS('html.mobile .dialogFooter', {padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0))'})
ensureCSS('html.mobile .dialogFooter button', {flex: '1 1 auto', minHeight: '44px'})
ensureCSS('html.mobile .dialogField input:not([type=checkbox]):not([type=radio]), html.mobile .dialogField select, html.mobile .dialogField textarea', {minHeight: '44px'})
ensureCSS('html.mobile .dialogField textarea', {minHeight: '6em'})
ensureCSS('html.mobile .msgmeta', {borderBottomWidth: '1px', borderBottomColor: styles.borderColor, flexShrink: 0})
ensureCSS('html.mobile .msgMobileSummary', {display: 'block', padding: '8px 12px 6px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .msgHeaderDetails:not(.expanded) .msgHeaders, html.mobile .msgHeaderDetails:not(.expanded) .msgHeaderExtra', {display: 'none'})
ensureCSS('html.mobile .msgHeaderDetails.expanded .msgHeaders', {fontSize: '13px', padding: '8px 12px 4px'})
ensureCSS('html.mobile .msgHeaderDetails.expanded .msgHeaders tr', {display: 'block', marginBottom: '.35em'})
ensureCSS('html.mobile .msgHeaderDetails.expanded .msgHeaders td', {display: 'block', textAlign: 'left', padding: '0'})
ensureCSS('html.mobile .msgHeaderDetails.expanded .msgHeaders td:first-child', {fontWeight: '600', color: styles.colorMild, marginBottom: '1px', fontSize: '11px'})
ensureCSS('html.mobile .msgHeaderDetails.expanded .msgFromReceivedSpread', {flexDirection: 'column', alignItems: 'flex-start', gap: '2px'})
ensureCSS('html.mobile .msgmeta .pad', {padding: '6px 10px'})
ensureCSS('html.mobile .msgModeBar', {flexWrap: 'nowrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: '6px', alignItems: 'center'})
ensureCSS('html.mobile .msgModeBar .btngroup', {flexShrink: 0})
ensureCSS('html.mobile .msgModeBar .btngroup button', {padding: '5px 10px', fontSize: '12px', whiteSpace: 'nowrap'})
ensureCSS('html.mobile .inlineAttachmentsLine', {fontSize: '12px'})
ensureCSS('html.mobile .headerBodySeparator', {display: 'none'})
ensureCSS('html:not(.mobile) .composePopup', {padding: '0', width: 'min(42em, calc(100vw - 2rem))', minWidth: '0', maxWidth: 'calc(100vw - 2rem)', overflow: 'hidden', border: '1px solid', borderColor: styles.floatBorderColor, boxShadow: styles.floatShadow})
ensureCSS('html:not(.mobile) .composeForm', {minHeight: 0, overflow: 'hidden'})
ensureCSS('html:not(.mobile) .composeFields', {flex: '1 1 auto', minHeight: 0, overflowY: 'auto', gap: '0', border: 'none', margin: 0, padding: 0})
ensureCSS('html:not(.mobile) .composeFields table', {borderCollapse: 'separate', borderSpacing: '0'})
ensureCSS('html:not(.mobile) .composeFields table tr td', {padding: '7px 16px', verticalAlign: 'middle'})
ensureCSS('html:not(.mobile) .composeFields table tr td:first-child', {width: '5.5em', paddingRight: '10px', whiteSpace: 'nowrap'})
ensureCSS('html:not(.mobile) .composeTextMild', {textAlign: 'right', fontSize: '13px', fontWeight: 500, color: styles.colorMild})
ensureCSS('html:not(.mobile) .composeHeaderRow td', {paddingTop: '12px', paddingBottom: '12px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html:not(.mobile) .composeFromBar', {display: 'flex', alignItems: 'center', gap: '12px', width: '100%', minWidth: 0})
ensureCSS('html:not(.mobile) .composeFromLabel', {display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 auto', minWidth: 0, margin: 0, fontSize: '13px', fontWeight: 500, color: styles.colorMild})
ensureCSS('html:not(.mobile) .composeFromLabel select', {flex: '1 1 auto', minWidth: '10em', minHeight: '34px', maxWidth: '100%'})
ensureCSS('html:not(.mobile) .composeHeaderActions', {display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, marginLeft: 'auto'})
ensureCSS('html:not(.mobile) .composeToolbarRow td', {paddingTop: '8px', paddingBottom: '10px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html:not(.mobile) .composeToolbarBtns', {display: 'flex', flexWrap: 'wrap', gap: '6px'})
ensureCSS('html:not(.mobile) .composeToolbarBtns button', {padding: '4px 10px', fontSize: '12px', lineHeight: 1.3, height: 'auto', minHeight: '28px'})
ensureCSS('html:not(.mobile) .composeAddrRow td', {borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html:not(.mobile) .composeFields table tr.composeSubjectRow td', {borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html:not(.mobile) .composeCell > span', {display: 'flex', alignItems: 'stretch', gap: '6px', width: '100%', marginBottom: '4px'})
ensureCSS('html:not(.mobile) .composeCell > span:last-child', {marginBottom: 0})
ensureCSS('html:not(.mobile) .composeCell .autosize', {flex: '1 1 0', minWidth: 0, display: 'grid', width: '100%', maxWidth: '100%'})
ensureCSS('html:not(.mobile) .composeCell input, html:not(.mobile) .composeFields table tr.composeSubjectRow input', {width: '100%', boxSizing: 'border-box', height: '34px', minHeight: '34px', padding: '0 10px'})
ensureCSS('html:not(.mobile) .composeCell .btnIcon', {width: '34px', minWidth: '34px', height: '34px', minHeight: '34px', flexShrink: 0, alignSelf: 'auto', boxSizing: 'border-box'})
ensureCSS('html:not(.mobile) .composeFields textarea.mono', {display: 'block', flex: '1 1 auto', minHeight: '14em', margin: '0', padding: '12px 16px', width: '100%', boxSizing: 'border-box', border: 'none', borderTop: '1px solid', borderBottom: '1px solid', borderColor: styles.borderColor, borderRadius: 0, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5})
ensureCSS('html:not(.mobile) .composeMeta', {padding: '12px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor, display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: styles.backgroundColor})
ensureCSS('html:not(.mobile) .composeMeta label', {display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', margin: 0, fontSize: '13px', fontWeight: 500, color: styles.colorMild})
ensureCSS('html:not(.mobile) .composeMeta label select, html:not(.mobile) .composeMeta input[type=file]', {flex: '1 1 12em', minWidth: 0, maxWidth: '100%'})
ensureCSS('html:not(.mobile) .composeSchedulePresets', {display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px'})
ensureCSS('html:not(.mobile) .composeFooter', {display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', padding: '12px 16px', borderTop: '1px solid', borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, flexShrink: 0})
ensureCSS('html:not(.mobile) .composeFooter button[type=submit]', {minWidth: '6em', padding: '8px 20px', fontWeight: 600})
ensureCSS('html.mobile .composePopupMobile', {position: 'fixed', inset: '0', width: '100%', height: '100%', maxWidth: 'none', minWidth: '0', borderRadius: '0', border: 'none', boxShadow: 'none', margin: '0', padding: '0', paddingTop: 'env(safe-area-inset-top, 0)', paddingBottom: 'env(safe-area-inset-bottom, 0)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column'})
ensureCSS('html.mobile .composePopupMobile .composeResizeGrab', {display: 'none'})
ensureCSS('html.mobile .composePopupMobile .composeForm', {flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: '0'})
ensureCSS('html.mobile .composePopupMobile .composeFields', {flex: '1 1 auto', minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0', border: 'none', margin: 0, padding: 0})
ensureCSS('html.mobile .composePopupMobile table, html.mobile .composePopupMobile tr, html.mobile .composePopupMobile td', {display: 'block', width: '100%', boxSizing: 'border-box'})
ensureCSS('html.mobile .composePopupMobile .composeFields table tr', {marginBottom: '0'})
ensureCSS('html.mobile .composePopupMobile .composeTextMild', {textAlign: 'left', display: 'block', marginBottom: '4px', fontWeight: 600, fontSize: '12px', color: styles.colorMild})
ensureCSS('html.mobile .composePopupMobile .composeHeaderRow', {padding: '12px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .composePopupMobile .composeHeaderRow td', {padding: '0'})
ensureCSS('html.mobile .composePopupMobile .composeFromBar', {display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px'})
ensureCSS('html.mobile .composePopupMobile .composeFromLabel', {display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px', margin: 0, fontSize: '12px', fontWeight: 600, color: styles.colorMild})
ensureCSS('html.mobile .composePopupMobile .composeFromLabel select', {width: '100%', maxWidth: '100%', minHeight: '44px', height: '44px', boxSizing: 'border-box'})
ensureCSS('html.mobile .composePopupMobile .composeHeaderActions', {display: 'flex', gap: '8px'})
ensureCSS('html.mobile .composePopupMobile .composeHeaderActions button', {flex: '1 1 0', minHeight: '44px'})
ensureCSS('html.mobile .composePopupMobile .composeToolbarRow', {padding: '10px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .composePopupMobile .composeToolbarRow td', {padding: '0'})
ensureCSS('html.mobile .composePopupMobile .composeToolbarBtns', {display: 'flex', flexWrap: 'wrap', gap: '6px'})
ensureCSS('html.mobile .composePopupMobile .composeToolbarBtns button', {padding: '6px 12px', fontSize: '13px', minHeight: '36px', height: 'auto'})
ensureCSS('html.mobile .composePopupMobile .composeAddrRow', {padding: '10px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .composePopupMobile .composeAddrRow td', {padding: '0'})
ensureCSS('html.mobile .composePopupMobile .composeSubjectRow', {padding: '10px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor})
ensureCSS('html.mobile .composePopupMobile .composeSubjectRow td', {padding: '0'})
ensureCSS('html.mobile .composePopupMobile .composeCell > span', {display: 'flex', alignItems: 'stretch', gap: '8px', width: '100%', marginBottom: '6px'})
ensureCSS('html.mobile .composePopupMobile .composeCell > span:last-child', {marginBottom: 0})
ensureCSS('html.mobile .composePopupMobile .composeCell .autosize', {flex: '1 1 0', minWidth: 0, display: 'grid', width: '100%', maxWidth: '100%'})
ensureCSS('html.mobile .composePopupMobile td .autosize', {display: 'grid', width: '100%', maxWidth: '100%', boxSizing: 'border-box'})
ensureCSS('html.mobile .composePopupMobile .composeCell input, html.mobile .composePopupMobile .composeSubjectRow input', {width: '100%', boxSizing: 'border-box', height: '44px', minHeight: '44px', padding: '0 10px'})
ensureCSS('html.mobile .composePopupMobile .autosize.input', {width: '100%'})
ensureCSS('html.mobile .composePopupMobile .composeCell .btnIcon', {width: '44px', minWidth: '44px', height: '44px', minHeight: '44px', flexShrink: 0, alignSelf: 'auto', boxSizing: 'border-box'})
ensureCSS('html.mobile .composePopupMobile textarea.mono', {fontFamily: 'inherit', minHeight: '12em', flex: '1 1 auto', width: '100%', boxSizing: 'border-box', border: 'none', borderTop: '1px solid', borderBottom: '1px solid', borderColor: styles.borderColor, borderRadius: 0, padding: '12px 16px', lineHeight: 1.5})
ensureCSS('html.mobile .composePopupMobile .composeMeta', {padding: '12px 16px', borderBottom: '1px solid', borderBottomColor: styles.borderColor, display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: styles.backgroundColor})
ensureCSS('html.mobile .composePopupMobile .composeMeta label', {display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px', margin: 0, fontSize: '12px', fontWeight: 600, color: styles.colorMild})
ensureCSS('html.mobile .composePopupMobile .composeMeta label select, html.mobile .composePopupMobile .composeMeta input[type=file], html.mobile .composePopupMobile .composeMeta input[type=datetime-local]', {width: '100%', maxWidth: '100%', minHeight: '44px', boxSizing: 'border-box'})
ensureCSS('html.mobile .composePopupMobile .composeSchedulePresets', {display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px'})
ensureCSS('html.mobile .composePopupMobile .composeFooter', {display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0, padding: '12px 16px calc(12px + env(safe-area-inset-bottom, 0))', borderTop: '1px solid', borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, marginTop: '0'})
ensureCSS('html.mobile .composePopupMobile .composeFooter button', {width: '100%', minHeight: '44px'})
ensureCSS('html.mobile .composePopupMobile .composeFooter button[type=submit]', {fontWeight: 600})
ensureCSS('.searchHeaderRow', {display: 'flex', alignItems: 'stretch', gap: '8px', width: '100%'})
ensureCSS('.searchHeaderRow input', {flex: '1 1 0', minWidth: 0, boxSizing: 'border-box', minHeight: '38px', height: '38px'})
ensureCSS('.searchHeaderActions', {display: 'flex', gap: '6px', flexShrink: 0, alignItems: 'stretch'})
ensureCSS('.searchHeaderRow .btnIcon', {width: '38px', minWidth: '38px', height: '38px', minHeight: '38px', boxSizing: 'border-box'})
ensureCSS('html.mobile .webmailRoot', {paddingBottom: 'env(safe-area-inset-bottom, 0)'})
ensureCSS('html.mobile .yscroll, html.mobile .yscrollAuto', {touchAction: 'pan-y'})

const yscrollStyle = css('yscroll', {overflowY: 'scroll', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0})
const yscrollAutoStyle = css('yscrollAuto', {overflowY: 'auto', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0})

// Input elements that automatically grow based on input, with additional JS.
css('autosize', {display: 'inline-grid', maxWidth: '90vw'})
ensureCSS('.autosize.input', {gridArea: '1 / 2'})
ensureCSS('.autosize::after', {content: 'attr(data-value)', marginRight: '1em', lineHeight: 0, visibility: 'hidden', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', overflowX: 'hidden'})


// From HTML.
declare let page: HTMLElement
// From customization script.
declare let moxBeforeDisplay: (root: HTMLElement) => void

let moxversion: string
let moxgoos: string
let moxgoarch: string

// All logging goes through log() instead of console.log, except "should not happen" logging.
let log: (...args: any[]) => void = () => {}
try {
	if (localStorage.getItem('log') || location.hostname === 'localhost') {
		log = console.log
	}
} catch (err) {}

let accountSettings: api.Settings
let introboxMailbox: string = ''

const defaultSettings = {
	mailboxesWidth: 240,
	layout: 'leftright', // leftright, topbottom, or auto. Auto still follows the window width.
	leftWidthPct: 50, // Split in percentage of remaining width for left/right layout.
	topHeightPct: 40, // Split in percentage of remaining height for top/bottom layout.
	msglistflagsWidth: 40, // Width in pixels of flags column in message list.
	msglistageWidth: 70, // Width in pixels of age column.
	msglistfromPct: 30, // Percentage of remaining width in message list to use for "from" column. The remainder is for the subject.
	refine: '', // Refine filters, e.g. '', 'attachments', 'read', 'unread', 'flagged', 'label:...'.
	orderAsc: false, // Order from most recent to least recent by default.
	ignoreErrorsUntil: 0, // For unhandled javascript errors/rejected promises, we normally show a popup for details, but users can ignore them for a week at a time.
	mailboxCollapsed: {} as {[mailboxID: number]: boolean}, // Mailboxes that are collapsed.
	showAllHeaders: false, // Whether to show all message headers.
	threading: api.ThreadMode.ThreadOn,
	checkConsistency: location.hostname === 'localhost', // Enable UI update consistency checks, default only for local development.
	composeWidth: 0,
	composeViewportWidth: 0,
	composeHeight: 0,
	composeViewportHeight: 0,
}
const parseSettings = (): typeof defaultSettings => {
	try {
		const v = window.localStorage.getItem('settings')
		if (!v) {
			return {...defaultSettings}
		}
		const x = JSON.parse(v)
		const def: {[key: string]: any} = defaultSettings
		const getString = (k: string, ...l: string[]): string => {
			const v = x[k]
			if (typeof v !== 'string' || l.length > 0 && !l.includes(v)) {
				return def[k] as string
			}
			return v
		}
		const getBool = (k: string): boolean => {
			const v = x[k]
			return typeof v === 'boolean' ? v : def[k] as boolean
		}
		const getInt = (k: string): number => {
			const v = x[k]
			return typeof v === 'number' ? v : def[k] as number
		}
		let mailboxCollapsed: {[mailboxID: number]: boolean} = x.mailboxCollapsed
		if (!mailboxCollapsed || typeof mailboxCollapsed !== 'object') {
			mailboxCollapsed = def.mailboxCollapsed
		}

		return {
			refine: getString('refine'),
			orderAsc: getBool('orderAsc'),
			mailboxesWidth: getInt('mailboxesWidth'),
			leftWidthPct: getInt('leftWidthPct'),
			topHeightPct: getInt('topHeightPct'),
			msglistflagsWidth: getInt('msglistflagsWidth'),
			msglistageWidth: getInt('msglistageWidth'),
			msglistfromPct: getInt('msglistfromPct'),
			ignoreErrorsUntil: getInt('ignoreErrorsUntil'),
			layout: getString('layout', 'auto', 'leftright', 'topbottom'),
			mailboxCollapsed: mailboxCollapsed,
			showAllHeaders: getBool('showAllHeaders'),
			threading: getString('threading', api.ThreadMode.ThreadOff, api.ThreadMode.ThreadOn, api.ThreadMode.ThreadUnread) as api.ThreadMode,
			checkConsistency: getBool('checkConsistency'),
			composeWidth: getInt('composeWidth'),
			composeViewportWidth: getInt('composeViewportWidth'),
			composeHeight: getInt('composeHeight'),
			composeViewportHeight: getInt('composeViewportHeight'),
		}
	} catch (err) {
		console.log('getting settings from localstorage', err)
		return {...defaultSettings}
	}
}

// Store new settings. Called as settingsPut({...settings, updatedField: newValue}).
const settingsPut = (nsettings: typeof defaultSettings) => {
	settings = nsettings
	try {
		window.localStorage.setItem('settings', JSON.stringify(nsettings))
	} catch (err) {
		console.log('storing settings in localstorage', err)
	}
}

let settings = parseSettings()

// All addresses for this account, can include "@domain" wildcard, User is empty in
// that case. Set when SSE connection is initialized.
let accountAddresses: api.MessageAddress[] = []

// Username/email address of login. Used as default From address when composing
// a new message.
let loginAddress: api.MessageAddress | null = null

// Localpart config (catchall separator and case sensitivity) for each domain
// the account has an address for.
let domainAddressConfigs: {[domainASCII: string]: api.DomainAddressConfig} = {}

// Mailbox containing rejects.
let rejectsMailbox: string = ''

// Last known server version. For asking to reload.
let lastServerVersion: string = ''

// Timers for marking messages as read or non-junk. Maps Message.ID to list of
// setTimeout timer id's. These timer id's are canceled when messages are
// permanently deleted.
let scheduledTimers = new Map<number, number[]>()

const login = async (reason: string) => {
	popupOpen = true // Prevent global key event handler from consuming keys.
	return new Promise<string>((resolve: (v: string) => void, _) => {
		const origFocus = document.activeElement
		let reasonElem: HTMLElement
		let fieldset: HTMLFieldSetElement
		let autosize: HTMLElement
		let username: HTMLInputElement
		let password: HTMLInputElement
		const root = dom.div(
			css('loginOverlay', {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: styles.overlayOpaqueBackgroundColor, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: zindexes.login, animation: 'fadein .15s ease-in'}),
			dom.div(
				style({display: 'flex', flexDirection: 'column', alignItems: 'center'}),
				reasonElem=reason ? dom.div(css('sessionError', {marginBottom: '2ex', textAlign: 'center'}), reason) : dom.div(),
				dom.div(
					css('loginPopup', {
						backgroundColor: styles.popupBackgroundColor,
						boxShadow: styles.floatShadow,
						border: '1px solid',
						borderColor: styles.floatBorderColor,
						borderRadius: styles.radius,
						padding: '1.5em',
						maxWidth: '95vw',
						overflowX: 'auto',
						maxHeight: '95vh',
						overflowY: 'auto',
						marginBottom: '20vh',
					}),
					dom.form(
						async function submit(e: SubmitEvent) {
							e.preventDefault()
							e.stopPropagation()

							reasonElem.remove()

							try {
								fieldset.disabled = true
								const loginToken = await client.LoginPrep()
								const token = await client.Login(loginToken, username.value, password.value)
								try {
									window.localStorage.setItem('webmailcsrftoken', token)
								} catch (err) {
									console.log('saving csrf token in localStorage', err)
								}
								root.remove()
								if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
									origFocus.focus()
								}
								popupOpen = false
								resolve(token)
							} catch (err) {
								console.log(ui("login error"), err)
								window.alert(ui("Error: ") + errmsg(err))
							} finally {
								fieldset.disabled = false
							}
						},
						fieldset=dom.fieldset(
							dom.h1(ui('Mail')),
							dom.label(
								style({display: 'block', marginBottom: '2ex'}),
								dom.div(ui("Email address"), style({marginBottom: '.5ex'})),
								autosize=dom.span(dom._class('autosize'),
									username=dom.input(
										attr.required(''),
										attr.autocomplete('email'),
										attr.placeholder(ui('jane@example.org')),
										function change() { autosize.dataset.value = username.value },
										function input() { autosize.dataset.value = username.value },
									),
								),
							),
							dom.label(
								style({display: 'block', marginBottom: '2ex'}),
								dom.div(ui("Password"), style({marginBottom: '.5ex'})),
								password=dom.input(attr.type('password'), attr.autocomplete('current-password'), attr.required('')),
							),
							dom.div(
								style({textAlign: 'center'}),
								dom.submitbutton(ui("Login")),
							),
						),
					)
				)
			)
		)
		document.body.appendChild(root)
		username.focus()
	})
}

const localStorageGet = (k: string): string | null => {
	try {
		return window.localStorage.getItem(k)
	} catch (err) {
		return null
	}
}

const localStorageRemove = (k: string) => {
	try {
		return window.localStorage.removeItem(k)
	} catch (err) {
	}
}

const client = new api.Client().withOptions({csrfHeader: 'x-mox-csrf', login: login}).withAuthToken(localStorageGet('webmailcsrftoken') || '')

// Link returns a clickable link with rel="noopener noreferrer".
const link = (href: string, anchorOpt?: string): HTMLElement => dom.a(attr.href(href), attr.rel('noopener noreferrer'), attr.target('_blank'), anchorOpt || href)

// Returns first own account address matching an address in l.
const envelopeIdentity = (l: api.MessageAddress[]): api.MessageAddress | null => {
	for (const a of l) {
		const ma = accountAddresses.find(aa => (!aa.User || aa.User === a.User) && aa.Domain.ASCII === a.Domain.ASCII)
		if (ma) {
			return {Name: ma.Name, User: a.User, Domain: a.Domain}
		}
	}
	return null
}

// We can display keyboard shortcuts when a user clicks a button that has a shortcut.
let shortcutElem = dom.div(css('shortcutFlash', {fontSize: '2em', position: 'absolute', left: '.25em', bottom: '.25em', backgroundColor: styles.accent, padding: '0.25em .5em', color: 'white', borderRadius: styles.radius, boxShadow: styles.shadowSm}))
let shortcutTimer = 0
const showShortcut = (c: string) => {
	if (accountSettings?.NoShowShortcuts) {
		return
	}
	if (shortcutTimer) {
		window.clearTimeout(shortcutTimer)
	}
	shortcutElem.remove()
	dom._kids(shortcutElem, c)
	document.body.appendChild(shortcutElem)
	shortcutTimer = window.setTimeout(() => {
		shortcutElem.remove()
		shortcutTimer = 0
	}, 1500)
}

// Commands for buttons that can have a shortcut.
type command = () => Promise<void>

// Call cmdfn and display the shortcut for the command if it occurs in shortcuts.
const shortcutCmd = async (cmdfn: command, shortcuts: {[key: string]: command}) => {
	let shortcut = ''
	for (const k in shortcuts) {
		if (shortcuts[k] === cmdfn) {
			shortcut = k
			break
		}
	}
	if (shortcut) {
		showShortcut(shortcut)
	}
	await cmdfn()
}

// clickCmd returns a click handler that runs a cmd and shows its shortcut.
const clickCmd = (cmdfn: command, shortcuts: {[key: string]: command}) => {
	return async function click() {
		shortcutCmd(cmdfn, shortcuts)
	}
}

// enterCmd returns a keydown handler that runs a cmd when Enter is pressed and shows its shortcut.
const enterCmd = (cmdfn: command, shortcuts: {[key: string]: command}) => {
	return async function keydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.stopPropagation()
			shortcutCmd(cmdfn, shortcuts)
		}
	}
}

// keyHandler returns a function that handles keyboard events for a map of
// shortcuts, calling the shortcut function if found.
const keyHandler = (shortcuts: {[key: string]: command}) => {
	return async (k: string, e: KeyboardEvent) => {
		const fn = shortcuts[k]
		if (fn) {
			e.preventDefault()
			e.stopPropagation()
			fn()
		}
	}
}

// For attachment sizes.
const formatSize = (size: number) => size > 1024*1024 ? (size/(1024*1024)).toFixed(1)+'mb' : Math.ceil(size/1024)+'kb'

// Parse size as used in minsize: and maxsize: in the search bar.
const parseSearchSize = (s: string): [string, number] => {
	s = s.trim()
	if (!s) {
		return ['', 0]
	}
	const digits = s.match(/^([0-9]+)/)?.[1]
	if (!digits) {
		return ['', 0]
	}
	let num = parseInt(digits)
	if (isNaN(num)) {
		return ['', 0]
	}
	const suffix = s.substring(digits.length).trim().toLowerCase()
	if (['b', 'kb', 'mb', 'gb'].includes(suffix)) {
		return [digits+suffix, num*Math.pow(2, 10*['b', 'kb', 'mb', 'gb'].indexOf(suffix))]
	}
	if (['k', 'm', 'g'].includes(suffix)) {
		return [digits+suffix+'b', num*Math.pow(2, 10*(1+['k', 'm', 'g'].indexOf(suffix)))]
	}
	return ['', 0]
}

// JS date does not allow months and days as single digit, it requires a 0
// prefix in those cases, so fix up such dates.
const fixDate = (dt: string): string => {
	const t = dt.split('-')
	if (t.length !== 3) {
		return dt
	}
	if(t[1].length === 1) {
		t[1] = '0'+t[1]
	}
	if(t[2].length === 1) {
		t[2] = '0'+t[2]
	}
	return t.join('-')
}

// Parse date and/or time, for use in searchbarElem with start: and end:.
const parseSearchDateTime = (s: string, isstart: boolean): string | undefined => {
	const t = s.split('T', 2)
	if (t.length === 2) {
		const d = new Date(fixDate(t[0]) + 'T'+t[1])
		return d ? d.toJSON() : undefined
	} else if (t.length === 1) {
		const fds = fixDate(t[0])
		if (!isNaN(Date.parse(fds))) {
			const d = new Date(fds)
			if (!isstart) {
				d.setDate(d.getDate()+1)
			}
			return d.toJSON()
		} else {
			const tm = t[0]
			const now = new Date()
			const pad0 = (v: number) => v <= 9 ? '0'+v : ''+v
			const d = new Date([now.getFullYear(), pad0(now.getMonth()+1), pad0(now.getDate())].join('-')+'T'+tm)
			return d ? d.toJSON() : undefined
		}
	}
	return undefined
}

// The searchbarElem is parsed into tokens, each with: minus prefix ("not" match),
// a tag (e.g. "minsize" in "minsize:1m"), a string, and whether the string was
// quoted (text that starts with a dash or looks like a tag needs to be quoted). A
// final ending quote is implicit. All input can be parsed into tokens, there is no
// invalid syntax (at most unexpected parsing).
type Token = [boolean, string, boolean, string]

const dquote = (s: string): string => '"' + s.replaceAll('"', '""') + '"'
const needsDquote = (s: string): boolean => /[ \t"]/.test(s)
const packToken = (t: Token): string => (t[0] ? '-' : '') + (t[1] ? t[1]+':' : '') + (t[2] || needsDquote(t[3]) ? dquote(t[3]) : t[3])

// Parse the text from the searchbarElem into tokens. All input is valid.
const parseSearchTokens = (s: string): Token[] => {
	if (!s) {
		return []
	}
	const l: Token[] = [] // Tokens we gathered.

	let not = false
	let quoted = false // If double quote was seen.
	let quoteend = false // Possible closing quote seen. Can also be escaped quote.
	let t = '' // Current token. We only keep non-empty tokens.
	let tquoted = false // If t started out quoted.
	const add = () => {
		if (t && (tquoted || !t.includes(':'))) {
			l.push([not, '', tquoted, t])
		} else if (t) {
			const tag = t.split(':', 1)[0]
			l.push([not, tag, tquoted, t.substring(tag.length+1)])
		}
		t = ''
		quoted = false
		quoteend = false
		tquoted = false
		not = false
	}
	;[...s].forEach(c => {
		if (quoteend) {
			if (c === '"') {
				t += '"'
				quoteend = false
			} else if (t) {
				add()
			}
		} else if (quoted && c === '"') {
			quoteend = true
		} else if (c === '"') {
			quoted = true
			if (!t) {
				tquoted = true
			}
		} else if (!quoted && (c === ' ' || c === '\t')) {
			add()
		} else if (c === '-' && !t && !tquoted && !not) {
			not = true
		} else {
			t += c
		}
	})
	add()
	return l
}

// returns a filter with empty/zero required fields.
const newFilter = (): api.Filter => {
	return {
		MailboxID: 0,
		MailboxChildrenIncluded: false,
		MailboxName: '',
		Attachments: api.AttachmentType.AttachmentIndifferent,
		SizeMin: 0,
		SizeMax: 0,
	}
}
const newNotFilter = (): api.NotFilter => {
	return {
		Attachments: api.AttachmentType.AttachmentIndifferent,
	}
}

// We keep the original strings typed in by the user, we don't send them to the
// backend, so we keep them separately from api.Filter.
type FilterStrs = {
	Oldest: string
	Newest: string
	SizeMin: string
	SizeMax: string
}

// Parse search bar into filters that we can use to populate the form again, or
// send to the server.
const parseSearch = (searchquery: string, mailboxlistView: MailboxlistView): [api.Filter, api.NotFilter, FilterStrs] => {
	const tokens = parseSearchTokens(searchquery)

	const fpos = newFilter()
	fpos.MailboxID = -1 // All mailboxes excluding Trash/Junk/Rejects.
	const notf = newNotFilter()
	const strs = {Oldest: '', Newest: '', SizeMin: '', SizeMax: ''}
	tokens.forEach(t => {
		const [not, tag, _, s] = t
		const f = not ? notf : fpos

		if (!not) {
			if (tag === 'mb' || tag === 'mailbox') {
				const mb = mailboxlistView.findMailboxByName(s)
				if (mb) {
					fpos.MailboxID = mb.ID
				} else if (s === '') {
					fpos.MailboxID = 0 // All mailboxes, including Trash/Junk/Rejects.
				} else {
					fpos.MailboxName = s
					fpos.MailboxID = 0
				}
				return
			} else if (tag === 'submb') {
				fpos.MailboxChildrenIncluded = true
				return
			} else if (tag === 'start') {
				const dt = parseSearchDateTime(s, true)
				if (dt) {
					fpos.Oldest = new Date(dt)
					strs.Oldest = s
					return
				}
			} else if (tag === 'end') {
				const dt = parseSearchDateTime(s, false)
				if (dt) {
					fpos.Newest = new Date(dt)
					strs.Newest = s
					return
				}
			} else if (tag === 'a' || tag === 'attachments') {
				if (s === 'none' || s === 'any' || s === 'image' || s === 'pdf' || s === 'archive' || s === 'zip' || s === 'spreadsheet' || s === 'document' || s === 'presentation') {
					fpos.Attachments = s as api.AttachmentType
					return
				}
			} else if (tag === 'h' || tag === 'header') {
				const k = s.split(':')[0]
				const v = s.substring(k.length+1)
				if (!fpos.Headers) {
					fpos.Headers = [[k, v]]
				} else {
					fpos.Headers.push([k, v])
				}
				return
			} else if (tag === 'minsize') {
				const [str, size] = parseSearchSize(s)
				if (str) {
					fpos.SizeMin = size
					strs.SizeMin = str
					return
				}
			} else if (tag === 'maxsize') {
				const [str, size] = parseSearchSize(s)
				if (str) {
					fpos.SizeMax = size
					strs.SizeMax = str
					return
				}
			}
		}
		if (tag === 'f' || tag === 'from') {
			f.From = f.From || []
			f.From.push(s)
			return
		} else if (tag === 't' || tag === 'to') {
			f.To = f.To || []
			f.To.push(s)
			return
		} else if (tag === 's' || tag === 'subject') {
			f.Subject = f.Subject || []
			f.Subject.push(s)
			return
		} else if (tag === 'l' || tag === 'label') {
			f.Labels = f.Labels || []
			f.Labels.push(s)
			return
		}
		f.Words = f.Words || []
		f.Words.push((tag ? tag+':' : '') + s)
	})
	return [fpos, notf, strs]
}

// Errors in catch statements are of type unknown, we normally want its
// message.
const errmsg = (err: unknown) => ''+((err as any).message || '(no error message)')

// Return keydown handler that creates or updates the datalist of its target with
// autocompletion addresses. The tab key completes with the first selection.
let datalistgen = 1
const newAddressComplete = (): any => {
	let datalist: HTMLElement
	let completeMatches: string[] | null
	let completeSearch: string
	let completeFull: boolean

	let aborter: {abort?: () => void} = {}

	return async function keydown(e: KeyboardEvent) {
		const target = e.target as HTMLInputElement
		if (!datalist) {
			datalist = dom.datalist(attr.id('list-'+datalistgen++))
			target.parentNode!.insertBefore(datalist, target)
			target.setAttribute('list', datalist.id)
		}

		const search = target.value

		if (e.key === 'Tab') {
			const matches = (completeMatches || []).filter(s => s.includes(search))
			if (matches.length > 0) {
				target.value = matches[0]
				return
			} else if ((completeMatches || []).length === 0 && !search) {
				return
			}
		}

		if (completeSearch && search.includes(completeSearch) && completeFull) {
			dom._kids(datalist, (completeMatches || []).filter(s => s.includes(search)).map(s => dom.option(s)))
			return
		} else if (search === completeSearch) {
			return
		}
		if (aborter.abort) {
			aborter.abort()
		}
		aborter = {}
		try {
			[completeMatches, completeFull] = await withStatus('Autocompleting addresses', client.withOptions({aborter: aborter}).CompleteRecipient(search))
			completeSearch = search
			dom._kids(datalist, (completeMatches || []).map(s => dom.option(s)))
		} catch (err) {
			log('autocomplete error', errmsg(err))
		} finally {
			aborter = {}
		}
	}
}

const flagList = (miv: MsgitemView): HTMLElement[] => {
	const msgflags: [string, string][] = [] // Flags for message in miv.
	const othermsgflags: [string, string][] = [] // Flags for descendant messages if miv is collapsed. Only flags not in msgflags.
	let l = msgflags

	const seen = new Set<string>()
	const flag = (v: boolean, char: string, name: string) => {
		if (v && !seen.has(name)) {
			l.push([name, char])
			seen.add(name)
		}
	}
	const addFlags = (mi: api.MessageItem, ownRow: boolean) => {
		const m = mi.Message
		flag(!m.Junk && !m.Notjunk, '?', ui('Unclassified, neither junk nor not junk: message does not contribute to spam classification of new incoming messages'))
		flag(m.Answered, 'r', ui('Replied/answered'))
		// The row button shows this message's flagged state. A collapsed child still uses the mark.
		if (!ownRow) {
			flag(m.Flagged, '!', ui('Flagged'))
		}
		flag(m.Forwarded, 'f', ui('Forwarded'))
		flag(m.Junk, 'j', ui('Junk'))
		flag(m.Deleted, 'D', ui('Deleted, used in IMAP, message will likely be removed soon.'))
		flag(m.Draft, 'd', ui('Draft'))
		flag(m.Phishing, 'p', ui('Phishing'))
		flag(mi.Attachments && mi.Attachments.length > 0 ? true : false, 'a', ui('Has at least one attachment'))
		if (m.ThreadMuted) {
			flag(true, 'm', ui('Muted, new messages are automatically marked as read.'))
		}
	}
	addFlags(miv.messageitem, true)
	if (miv.isCollapsedThreadRoot()) {
		l = othermsgflags
		for (miv of miv.descendants()) {
			addFlags(miv.messageitem, false)
		}
	}

	const flagCharIcons: { [key: string]: () => SVGSVGElement } = {
		'r': icons.reply,
		'!': icons.flag,
		'f': icons.forward,
		'j': icons.junk,
		'a': icons.attachment,
		'D': icons.trash,
	}

	const flagChar = (c: string) => {
		const fn = flagCharIcons[c]
		if (fn) {
			return fn()
		}
		return c
	}

	const msgItemFlagStyle = css('msgItemFlag', {marginRight: '1px', fontWeight: 'normal', fontSize: '.9em'})
	return msgflags.map(t => dom.span(msgItemFlagStyle, flagChar(t[1]), attr.title(t[0])))
		.concat(othermsgflags.map(t => dom.span(msgItemFlagStyle, css('msgItemFlagCollapsed', {color: styles.colorMilder}), flagChar(t[1]), attr.title(t[0]))))
}

// Turn filters from the search bar into filters with the refine filters (buttons
// above message list) applied, to send to the server in a request. The original
// filters are not modified.
const refineFilters = (f: api.Filter, notf: api.NotFilter): [api.Filter, api.NotFilter] => {
	const refine = settings.refine
	if (refine) {
		f = {...f}
		notf = {...notf}
		if (refine === 'unread') {
			notf.Labels = [...(notf.Labels || [])]
			notf.Labels = (notf.Labels || []).concat(['\\Seen'])
		} else if (refine === 'read') {
			f.Labels = [...(f.Labels || [])]
			f.Labels = (f.Labels || []).concat(['\\Seen'])
		} else if (refine === 'attachments') {
			f.Attachments = 'any' as api.AttachmentType
		} else if (refine === 'flagged') {
			f.Labels = [...(f.Labels || [])]
			f.Labels = (f.Labels || []).concat(['\\Flagged'])
		} else if (refine.startsWith('label:')) {
			f.Labels = [...(f.Labels || [])]
			f.Labels = (f.Labels || []).concat([refine.substring('label:'.length)])
		}
	}
	return [f, notf]
}

// For dragging the splitter bars. This function should be called on mousedown. e
// is the mousedown event. Move is the function to call when the bar was dragged,
// typically adjusting styling, e.g. absolutely positioned offsets, possibly based
// on the event.clientX and element bounds offset.
// The returned promise is resolved when dragging is done (and immediately if
// dragging wasn't activated).
const startDrag = (e: MouseEvent, move: (e: MouseEvent) => void): Promise<void> => {
	if (e.buttons !== 1) {
		return Promise.resolve()
	}
	return new Promise((resolve, _) => {
		e.preventDefault()
		e.stopPropagation()
		const stop = () => {
			document.body.removeEventListener('mousemove', move)
			document.body.removeEventListener('mouseup', stop)
			resolve()
		}
		document.body.addEventListener('mousemove', move)
		document.body.addEventListener('mouseup', stop)
	})
}

// Returns two handler functions: one for focus that sets a placeholder on the
// target element, and one for blur that restores/clears it again. Keeps forms uncluttered,
// only showing contextual help just before you start typing.
const focusPlaceholder = (s: string): any[] => {
	let orig = ''
	return [
		function focus(e: FocusEvent) {
			const target = (e.target! as HTMLElement)
			orig = target.getAttribute('placeholder') || ''
			target.setAttribute('placeholder', s)
		},
		function blur(e: FocusEvent) {
			const target = (e.target! as HTMLElement)
			if (orig) {
				target.setAttribute('placeholder', orig)
			} else {
				target.removeAttribute('placeholder')
			}
		},
	]
}

// Parse a location hash, with either mailbox or search terms, and optional
// selected message id, and/or draft message to compose. The special "#compose "
// hash, used for handling "mailto:"-links, must be handled before calling this
// function.
//
// Examples:
// #Inbox
// #Inbox,1
// #Inbox,1,compose:123
// #search mb:Inbox
// #search mb:Inbox,1
const parseLocationHash = (mailboxlistView: MailboxlistView): [string | undefined, number, number, api.Filter, api.NotFilter] => {
	let hash = decodeURIComponent((window.location.hash || '#').substring(1))

	// Pick off ",compose:<number>" at the end.
	let editMsgid = 0
	const em = hash.match(/,compose:([0-9]+)$/)
	if (em) {
		editMsgid = parseInt(em[1])
		hash = hash.substring(0, hash.length-em[0].length)
	}

	// Pick off ",<number>" at the end, for selected message.
	const m = hash.match(/,([0-9]+)$/)
	let msgid = 0
	if (m) {
		msgid = parseInt(m[1])
		hash = hash.substring(0, hash.length-m[0].length)
	}

	let initmailbox, initsearch
	if (hash.startsWith('search ')) {
		initsearch = hash.substring('search '.length).trim()
	}
	let f: api.Filter, notf: api.NotFilter
	if (initsearch) {
		[f, notf, ] = parseSearch(initsearch, mailboxlistView)
	} else {
		initmailbox = hash
		if (!initmailbox) {
			initmailbox = 'Inbox'
		}
		f = newFilter()
		const mb = mailboxlistView.findMailboxByName(initmailbox)
		if (mb) {
			f.MailboxID = mb.ID
		} else {
			f.MailboxName = initmailbox
		}
		notf = newNotFilter()
	}
	return [initsearch, msgid, editMsgid, f, notf]
}

// For HTMLElements like fieldset, input, buttons. We make it easy to disable
// elements while the API call they initiated is still in progress. Prevents
// accidental duplicate API call for twitchy clickers.
interface Disablable {
	disabled: boolean
}

// When API calls are made, we start displaying what we're doing after 1 second.
// Hopefully the command has completed by then, but slow operations, or in case of
// high latency, we'll start showing it. And hide it again when done. This should
// give a non-cluttered instant feeling most of the time, but informs the user when
// needed.
let statusElem: HTMLElement
const withStatus = async <T>(action: string, promise: Promise<T>, disablable?: Disablable, noAlert?: boolean): Promise<T> => {
	let elem: HTMLElement | undefined
	let id = window.setTimeout(() => {
		elem = dom.span(action+'... ')
		statusElem.appendChild(elem)
		id = 0
	}, 1000)
	// Could be the element we are going to disable, causing it to lose its focus. We'll restore afterwards.
	let origFocus = document.activeElement
	try {
		if (disablable) {
			disablable.disabled = true
		}
		return await promise
	} catch (err) {
		if (id) {
			window.clearTimeout(id)
			id = 0
		}
		// Generated by client for aborted requests, e.g. for api.ParsedMessage when loading a message.
		if ((err as any).code === 'sherpa:aborted') {
			throw err
		}
		if (!noAlert) {
			window.alert(ui('Error: ') + action + ': ' + errmsg(err))
		}
		// We throw the error again. The ensures callers that await their withStatus call
		// won't continue executing. We have a global handler for uncaught promises, but it
		// only handles javascript-level errors, not api call/operation errors.
		throw err
	} finally {
		if (disablable) {
			disablable.disabled = false
		}
		if (disablable && origFocus && document.activeElement !== origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
			origFocus.focus()
		}
		if (id) {
			window.clearTimeout(id)
		}
		if (elem) {
			elem.remove()
		}
	}
}

// One pending move can be undone. A newer move replaces it. The original message
// id survives MessageMove. The new id is only the expunged tombstone.
type MoveUndoGroup = { mailboxID: number, ids: number[] }
let moveUndo: { groups: MoveUndoGroup[] } | null = null
let moveUndoBar: HTMLElement | null = null
let moveUndoHost: HTMLElement | null = null

const clearMoveUndo = () => {
	moveUndo = null
	if (moveUndoBar) {
		moveUndoBar.remove()
		moveUndoBar = null
	}
}

const groupMoveSources = (sources: { id: number, mailboxID: number }[]): MoveUndoGroup[] => {
	const byBox = new Map<number, number[]>()
	for (const source of sources) {
		const ids = byBox.get(source.mailboxID)
		if (ids) {
			ids.push(source.id)
		} else {
			byBox.set(source.mailboxID, [source.id])
		}
	}
	return [...byBox].map(([mailboxID, ids]) => ({ mailboxID, ids }))
}

const offerMoveUndo = (sources: { id: number, mailboxID: number }[]) => {
	const groups = groupMoveSources(sources)
	if (groups.length === 0) {
		return
	}
	clearMoveUndo()
	const pending = { groups }
	moveUndo = pending
	moveUndoBar = dom.div(
		dom._class('moveUndoBar'),
		attr.role('status'),
		ui('Moved'),
		dom.clickbutton(ui('Undo'), async function click() {
			if (moveUndo !== pending) {
				return
			}
			clearMoveUndo()
			for (let i = 0; i < groups.length; i++) {
				try {
					await withStatus(ui('Moving back'), client.MessageMove(groups[i].ids, groups[i].mailboxID, false))
				} catch (err) {
					log({err})
					offerMoveUndo(groups.slice(i).flatMap(g => g.ids.map(id => ({ id, mailboxID: g.mailboxID }))))
					return
				}
			}
		}),
	)
	const onOpenMessage = document.documentElement.classList.contains('mobile') && document.documentElement.classList.contains('mobile-pane-message')
	const host = !onOpenMessage && moveUndoHost ? moveUndoHost : document.body
	if (host === document.body) {
		moveUndoBar.classList.add('moveUndoBarFloating')
	}
	host.appendChild(moveUndoBar)
}

const dismissMoveUndoUnless = (id: number) => {
	if (!moveUndo || moveUndo.groups.some(g => g.ids.includes(id))) {
		return
	}
	clearMoveUndo()
}

const forgetMovedMessages = (ids: number[]) => {
	if (moveUndo && ids.some(id => moveUndo!.groups.some(g => g.ids.includes(id)))) {
		clearMoveUndo()
	}
}

const withDisabled = async <T>(elem: {disabled: boolean}, p: Promise<T>): Promise<T> => {
	try {
		elem.disabled = true
		return await p
	} catch (err) {
		log({err})
		window.alert(ui('Error: ') + errmsg(err))
		throw err
	} finally {
		elem.disabled = false
	}
}

// Popover shows kids in a div on top of a mostly transparent overlay on top of
// the document. If transparent is set, the div the kids are in will not get a
// white background. If focus is set, it will be called after adding the
// popover change focus to it, instead of focusing the popover itself.
// Popover returns a function that removes the popover. Clicking the
// transparent overlay, or hitting Escape, closes the popover.
// The div with the kids is positioned around mouse event e, preferably
// towards the right and bottom. But when the position is beyond 2/3's of the
// width or height, it is positioned towards the other direction. The div with
// kids is scrollable if needed.
const popover = (target: HTMLElement, opts: {transparent?: boolean, fullscreen?: boolean}, ...kids: HTMLElement[]) => {
	clearMoveUndo()
	const origFocus = document.activeElement
	const pos = target.getBoundingClientRect()
	const close = () => {
		if (!root.parentNode) {
			return
		}
		root.remove()
		if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
			origFocus.focus()
		}
	}

	const posx = opts.fullscreen ?
		style({left: 0, right: 0}) :
		(
			pos.x < window.innerWidth/3 ?
				style({left: ''+(pos.x)+'px'}) :
				style({right: ''+(window.innerWidth - pos.x - pos.width)+'px'})
		)
	const posy = opts.fullscreen ?
		style({top: 0, bottom: 0}) :
		(
			pos.y+pos.height > window.innerHeight*2/3 ?
				style({bottom: ''+(window.innerHeight - (pos.y-1))+'px', maxHeight: ''+(pos.y - 1 - 10)+'px'}) :
				style({top: ''+(pos.y+pos.height+1)+'px', maxHeight: ''+(window.innerHeight - (pos.y+pos.height+1) - 10)+'px'})
		)

	let content: HTMLElement
	const root = dom.div(
		css('popoverOverlay', {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: zindexes.popover, backgroundColor: styles.overlayBackgroundColor}),
		function click(e: MouseEvent) {
			e.stopPropagation()
			close()
		},
		function keydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.stopPropagation()
				close()
			}
		},
		content=dom.div(
			attr.tabindex('0'),
			css('popoverContent', {
				position: 'absolute',
				overflowY: 'auto',
			}),
			posx, posy,
			function click(e: MouseEvent) {
				e.stopPropagation()
			},
			opts.transparent ? [] : [
				css('popoverContentOpaque', {
					backgroundColor: styles.popupBackgroundColor,
					padding: '1em',
					borderRadius: styles.radius,
					boxShadow: styles.floatShadow,
					border: '1px solid',
					borderColor: styles.floatBorderColor,
					color: styles.popupColor,
				}),
			],
			...kids,
		),
	)
	document.body.appendChild(root)
	const first = root.querySelector('input, select, textarea, button')
	if (first && first instanceof HTMLElement) {
		first.focus()
	} else {
		content.focus()
	}
	return close
}

const menuPopover = (target: HTMLElement, items: (HTMLElement | HTMLElement[])[], fit = false, listClass?: string): (() => void) => {
	const flat = items.flat().filter((b): b is HTMLElement => b instanceof HTMLElement)
	return popover(target, {transparent: true},
		dom.div(dom._class('menuList', ...(fit ? ['menuListFit'] : []), ...(listClass ? [listClass] : [])),
			...flat.map(item => dom.div(dom._class('menuItem'), item)),
		),
	)
}

// Popup shows kids in a centered div with white background on top of a
// transparent overlay on top of the window. Clicking the overlay or hitting
// Escape closes the popup. Scrollbars are automatically added to the div with
// kids. Returns a function that removes the popup.
// While a popup is open, no global keyboard shortcuts are handled. Popups get
// to handle keys themselves, e.g. for scrolling.
let popupOpen = false
const popup = (...kids: ElemArg[]) => {
	clearMoveUndo()
	const origFocus = document.activeElement
	const close = () => {
		if (!root.parentNode) {
			return
		}
		popupOpen = false
		root.remove()
		if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
			origFocus.focus()
		}
	}
	let content: HTMLElement
	const root = dom.div(
		css('popupOverlay', {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: styles.overlayBackgroundColor, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: zindexes.popup}),
		function keydown(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.stopPropagation()
				close()
			}
		},
		function click(e: MouseEvent) {
			e.stopPropagation()
			close()
		},
		content=dom.div(
			attr.tabindex('0'),
			dom._class('popupContent'),
			function click(e: MouseEvent) {
				e.stopPropagation()
			},
			kids,
		)
	)
	popupOpen = true
	document.body.appendChild(root)
	content.focus()
	return close
}

// Show settings screen.
const cmdSettings = async () => {
	let fieldset: HTMLFieldSetElement
	let signature: HTMLTextAreaElement
	let quoting: HTMLSelectElement
	let showAddressSecurity: HTMLInputElement
	let showHTML: HTMLInputElement
	let showShortcuts: HTMLInputElement
	let showHeaders: HTMLTextAreaElement

	if (!accountSettings) {
		throw new Error('No account settings fetched yet.')
	}

	const remove = popup(
		dom.form(
			dom._class('dialogForm'),
			dom._class('dialogPanel'),
			async function submit(e: SubmitEvent) {
				e.preventDefault()
				e.stopPropagation()
				const accSet: api.Settings = {
					ID: accountSettings.ID,
					Signature: signature.value,
					Quoting: quoting.value as api.Quoting,
					ShowAddressSecurity: showAddressSecurity.checked,
					ShowHTML: showHTML.checked,
					NoShowShortcuts: !showShortcuts.checked,
					ShowHeaders: showHeaders.value.split('\n').map(s => s.trim()).filter(s => !!s),
				}
				await withDisabled(fieldset, client.SettingsSave(accSet))
				accountSettings = accSet
				remove()
			},
			dom.div(dom._class('dialogHeader'),
				dom.h1(ui('Settings')),
				dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui('Close')), attr.title(ui('Close without saving.')), function click() {
					remove()
				}),
			),
			dom.div(dom._class('dialogBody'),
				fieldset=dom.fieldset(
					dom.div(dom._class('dialogField'),
						dom.label(dom._class('dialogFieldLabel'), ui('Signature')),
						signature=dom.textarea(
							new String(accountSettings.Signature),
							attr.rows(''+Math.max(3, 1+accountSettings.Signature.split('\n').length)),
						),
					),
					dom.div(dom._class('dialogField'),
						dom.label(dom._class('dialogFieldLabel'), ui('Reply above/below original'), attr.title(ui('Auto: If text is selected, only the replied text is quoted and editing starts below. Otherwise, the full message is quoted and editing starts at the top.'))),
						quoting=dom.select(
							dom.option(attr.value(''), ui('Auto')),
							dom.option(attr.value('bottom'), ui('Bottom'), accountSettings.Quoting === api.Quoting.Bottom ? attr.selected('') : []),
							dom.option(attr.value('top'), ui('Top'), accountSettings.Quoting === api.Quoting.Top ? attr.selected('') : []),
						),
					),
					dom.label(dom._class('dialogCheckField'),
						showAddressSecurity=dom.input(attr.type('checkbox'), accountSettings.ShowAddressSecurity ? attr.checked('') : []),
						dom.span(ui('Show address security indications'), attr.title(ui('Show bars underneath address input fields, indicating support for STARTTLS/DNSSEC/DANE/MTA-STS/RequireTLS.'))),
					),
					dom.label(dom._class('dialogCheckField'),
						showHTML=dom.input(attr.type('checkbox'), accountSettings.ShowHTML ? attr.checked('') : []),
						dom.span(ui('Show email as HTML instead of text by default for first-time senders'), attr.title(ui('Whether to show HTML or text is remembered per sender. This sets the default for unknown correspondents.'))),
					),
					dom.label(dom._class('dialogCheckField'),
						showShortcuts=dom.input(attr.type('checkbox'), accountSettings.NoShowShortcuts ? [] : attr.checked('')),
						dom.span(ui('Show shortcut keys in bottom left after interaction with mouse')),
					),
					dom.div(dom._class('dialogField'),
						dom.label(dom._class('dialogFieldLabel'), ui('Show additional headers')),
						showHeaders=dom.textarea(
							new String((accountSettings.ShowHeaders || []).join('\n')),
							attr.rows(''+Math.max(3, 1+(accountSettings.ShowHeaders || []).length)),
						),
						dom.p(dom._class('dialogFieldHint'), ui('One header name per line, for example Delivered-To, X-Mox-Reason, User-Agent, … Refresh mailbox view for changes to take effect.')),
					),
					dom.div(dom._class('dialogSection'),
						dom.div(dom._class('dialogSectionTitle'), ui('Mailto links')),
						dom.p(dom._class('dialogSectionText'), ui('Register "mailto:" links with the browser or operating system to compose a message in webmail.')),
						dom.div(dom._class('dialogActions'),
							dom.clickbutton(ui('Register'), attr.title(ui('In most browsers, registering is only allowed on HTTPS URLs. Your browser may ask for confirmation. If nothing appears to happen, the registration may already have been present.')), function click() {
								if (!window.navigator.registerProtocolHandler) {
									window.alert(ui('Registering a protocol handler ("mailto:") is not supported by your browser.'))
									return
								}
								try {
									window.navigator.registerProtocolHandler('mailto', '#compose %s')
									window.alert(ui('"mailto:"-links have been registered'))
								} catch (err) {
									window.alert(ui('Error registering "mailto:" protocol handler: ')+errmsg(err))
								}
							}),
							dom.clickbutton(ui('Unregister'), attr.title(ui('Not all browsers implement unregistering via JavaScript.')), function click() {
								if (!(window.navigator as any).unregisterProtocolHandler) {
									window.alert(ui('Unregistering a protocol handler ("mailto:") via JavaScript is not supported by your browser. See your browser settings to unregister.'))
									return
								}
								try {
									(window.navigator as any).unregisterProtocolHandler('mailto', '#compose %s')
								} catch (err) {
									window.alert(ui('Error unregistering "mailto:" protocol handler: ')+errmsg(err))
									return
								}
								window.alert(ui('"mailto:" protocol handler unregistered.'))
							}),
						),
					),
				),
			),
			dom.div(dom._class('dialogFooter'),
				dom.clickbutton(ui('Cancel'), function click(e: MouseEvent) {
					e.preventDefault()
					remove()
				}),
				dom.submitbutton(dom._class('btnPrimary'), ui('Save')),
			),
		),
	)
}

// Show help popup, with shortcuts and basic explanation.
const cmdHelp = async () => {
	const remove = popup(
		dom.div(
			dom._class('dialogPanel'),
			dom._class('helpPanel'),
			dom.div(dom._class('dialogHeader'),
				dom.h1(ui('Help and keyboard shortcuts')),
				dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui('Close')), attr.title(ui('Close help.')), function click() {
					remove()
				}),
			),
			dom.div(dom._class('dialogBody'),
				dom.div(dom._class('helpColumns'),
			dom.div(
				dom.table(
					dom.tr(dom.td(attr.colspan('2'), dom.h2(ui('Global'), style({margin: '0'})))),
					[
						['c', 'compose new message'],
						['/', 'search'],
						['i', 'open inbox'],
						['?', 'help'],
						['ctrl ?', 'tooltip for focused element'],
						['ctrl m', 'focus message'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),

					dom.tr(dom.td(attr.colspan('2'), dom.h2(ui('Mailbox'), style({margin: '0'})))),
					[
						['←', 'collapse'],
						['→', 'expand'],
						['b', 'show more actions'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),

					dom.tr(dom.td(attr.colspan('2'), dom.h2(ui('Message list'), style({margin: '1ex 0 0 0'})))),
					dom.tr(
						dom.td('↓', ', j'),
						dom.td(ui('down one message')),
						dom.td(
							attr.rowspan('6'),
							css('helpSideNote', {color: styles.colorMilder, borderLeft: '2px solid', borderLeftColor: styles.accent, paddingLeft: '.5em'}),
							dom.div(ui('hold ctrl to only move focus'), attr.title(ui('ctrl-l and ctrl-u are left for the browser the handle'))),
							dom.div(ui('hold shift to expand selection')),
						),
					),
					dom.tr(dom.td('↑', ', k'), dom.td(ui('up one message'))),
					[
						['PageDown, l', 'down one screen'],
						['PageUp, h', 'up one screen'],
						['End, .', 'to last message'],
						['Home, ,', 'to first message'],
						['Space', 'toggle selection of message'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),

					[
						['', ''],
						['d, Delete', 'move to trash folder'],
						['D', 'delete permanently'],
						['q', 'move to junk folder'],
						['Q', 'mark not junk'],
						['a', 'move to archive folder'],
						['M', 'mark unread and clear (non)junk flags'],
						['m', 'mark read'],
						['u', 'to next unread message'],
						['p', 'to root of thread or previous thread'],
						['n', 'to root of next thread'],
						['S', 'select thread messages'],
						['C', 'toggle thread collapse'],
						['X', 'toggle thread mute, automatically marking new messages as read'],
						['←', 'collapse thread'],
						['→', 'expand thread'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),
				),
			),
			dom.div(
				dom.table(
					dom.tr(dom.td(attr.colspan('2'), dom.h2(ui('Compose'), style({margin: '0'})))),
					[
						['ctrl Enter', 'send message'],
						['ctrl shift Enter', 'send message and archive thread'],
						['ctrl w', 'close message'],
						['ctrl O', 'add To'],
						['ctrl C', 'add Cc'],
						['ctrl B', 'add Bcc'],
						['ctrl Y', 'add Reply-To'],
						['ctrl Backspace', 'remove current address if empty'],
						['ctrl +', 'add address of same type'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),

					dom.tr(dom.td(attr.colspan('2'), dom.h2(ui('Message'), style({margin: '1ex 0 0 0'})))),
					[
						['r', 'reply or list reply'],
						['R', 'reply all'],
						['f', 'forward message'],
						['e', 'edit draft'],
						['v', 'view attachments'],
						['t', 'view text version'],
						['T', 'view HTML version'],
						['o', 'open message in new tab'],
						['O', 'show raw message'],
						['ctrl p', 'print message'],
						['I', 'toggle internals'],
						['ctrl i', 'toggle all headers'],

						['alt k, alt ArrowUp', 'scroll up'],
						['alt j, alt ArrowDown', 'scroll down'],
						['alt K', 'scroll to top'],
						['alt J', 'scroll to end'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),

					dom.tr(dom.td(dom.h2(ui('Attachments'), style({margin: '1ex 0 0 0'})))),
					[
						['left, h', 'previous attachment'],
						['right, l', 'next attachment'],
						['0', 'first attachment'],
						['$', 'next attachment'],
						['d', 'download'],
					].map(t => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))),
				),
				dom.div(style({marginTop: '2ex', marginBottom: '1ex'}), dom.span(ui('Underdotted text'), attr.title(ui('Underdotted text shows additional information on hover.'))), ui(' show an explanation or additional information when hovered.')),
				dom.div(style({marginBottom: '1ex'}), ui('Multiple messages can be selected by clicking messages while holding the control and/or shift keys. Dragging messages and dropping them on a mailbox moves the messages to that mailbox.')),
				dom.div(style({marginBottom: '1ex'}), ui('A word that mixes scripts, such as Latin and Cyrillic, with no space between them has an '), dom.span(dom._class('scriptswitch'), ui('orange underline')), ui('. That can be a sign of an intent to mislead (e.g. phishing).')),

				dom.div(style({marginTop: '2ex'}), ui('Mox is open source email server software, this is version '), moxversion, ', see ', dom.a(attr.href('licenses.txt'), ui('licenses')), '.', dom.br(), ui('Feedback, including bug reports, is appreciated! '), link('https://github.com/mjl-/mox/issues/new')),
			),
				),
			),
			dom.div(dom._class('dialogFooter'),
				dom.clickbutton(ui('Close'), function click() {
					remove()
				}),
			),
		),
	)
}

// Show tooltips for either the focused element, or otherwise for all elements
// that aren't reachable with tabindex and aren't marked specially to prevent
// them from showing up (e.g. dates in the msglistview, which can also been
// seen by opening a message).
const cmdTooltip = async () => {
	let elems: Element[] = []
	if (document.activeElement && document.activeElement !== document.body) {
		if (document.activeElement.getAttribute('title')) {
			elems = [document.activeElement]
		}
		elems = [...elems, ...document.activeElement.querySelectorAll('[title]')]
	}
	if (elems.length === 0) {
		// Find elements without a parent with tabindex=0.
		const seen: {[title: string]: boolean} = {}
		elems = [...document.body.querySelectorAll('[title]:not(.notooltip):not(.silenttitle)')].filter(e => {
			const title = e.getAttribute('title') || ''
			if (seen[title]) {
				return false
			}
			seen[title] = true
			return !(e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLButtonElement || e instanceof HTMLTextAreaElement || e instanceof HTMLAnchorElement || e.getAttribute('tabindex') || e.closest('[tabindex]'))
		})
	}
	if (elems.length === 0) {
		window.alert(ui('No active elements with tooltips found.'))
		return
	}
	popover(document.body, {transparent: true, fullscreen: true},
		...elems.map(e => {
			const title = e.getAttribute('title') || ''
			const pos = e.getBoundingClientRect()
			const hidden = pos.width === 0 && pos.height === 0
			if (hidden) {
				const bar = document.querySelector('.topBar')?.getBoundingClientRect()
				return dom.div(
					css('tooltipContent', {position: 'absolute', backgroundColor: [styles.mailboxesTopBackgroundColor, styles.backgroundColorMild], color: [styles.navTextHover, styles.color], borderRadius: styles.radius, padding: '.35em .5em', maxWidth: '50em', boxShadow: styles.shadowSm}),
					style({left: '50%', transform: 'translateX(-50%)', top: ((bar ? bar.bottom : 48) + 8) + 'px'}),
					title,
				)
			}
			return dom.div(
				css('tooltipContent', {position: 'absolute', backgroundColor: [styles.mailboxesTopBackgroundColor, styles.backgroundColorMild], color: [styles.navTextHover, styles.color], borderRadius: styles.radius, padding: '.35em .5em', maxWidth: '50em', boxShadow: styles.shadowSm}),
				pos.x < window.innerWidth/3 ?
					style({left: ''+(pos.x)+'px'}) :
					style({right: ''+(window.innerWidth - pos.x - pos.width)+'px'}),
				pos.y+pos.height > window.innerHeight*2/3 ?
					style({bottom: ''+(window.innerHeight - (pos.y-2))+'px', maxHeight: ''+(pos.y - 2)+'px'}) :
					style({top: ''+(pos.y+pos.height+2)+'px', maxHeight: ''+(window.innerHeight - (pos.y+pos.height+2))+'px'}),
				title,
			)
		})
	)
}

type ComposeOptions = {
	from?: api.MessageAddress[]
	// Addressees should be either directly an email address, or the header form "name
	// <localpart@domain>". They are parsed on the server when the message is
	// submitted.
	to?: string[]
	cc?: string[]
	bcc?: string[]
	replyto?: string
	subject?: string
	isForward?: boolean
	body?: string
	// Message from which to show the attachment to include.
	attachmentsMessageItem?: api.MessageItem
	// Message is marked as replied/answered or forwarded after submitting, and
	// In-Reply-To and References headers are added pointing to this message.
	responseMessageID?: number
	// Whether message is to a list, due to List-Id header.
	isList?: boolean
	editOffset?: number // For cursor, default at start.
	draftMessageID?: number // For composing for existing draft message, to be removed when message is sent.
	archiveReferenceMailboxID?: number // For "send and archive", the mailbox from which to move messages to the archive mailbox.
}

interface ComposeView {
	root: HTMLElement
	MsgID: number // Of saved draft. Used in URL hash.
	key: (k: string, e: KeyboardEvent) => Promise<void>
	unsavedChanges: () => boolean
	save: () => Promise<void>
}

let composeView: ComposeView | null = null

const compose = (opts: ComposeOptions, listMailboxes: listMailboxes, setLocationHash: setLocationHash) => {
	log('compose', opts)

	if (composeView) {
		// todo: should allow multiple
		window.alert(ui("Can only compose one message at a time."))
		return
	}

	type ForwardAttachmentView = {
		root: HTMLElement
		path: number[]
		checkbox: HTMLInputElement
	}

	type AddrView = {
		root: HTMLElement
		input: HTMLInputElement
		isRecipient: boolean
		recipientSecurity: null | api.RecipientSecurity
	}

	let fieldset: HTMLFieldSetElement
	let from: HTMLSelectElement
	let customFrom: HTMLInputElement | null = null
	let subjectAutosize: HTMLElement
	let subject: HTMLInputElement
	let body: HTMLTextAreaElement
	let attachments: HTMLInputElement
	let requiretls: HTMLSelectElement

	let toBtn: HTMLButtonElement, ccBtn: HTMLButtonElement, bccBtn: HTMLButtonElement, replyToBtn: HTMLButtonElement, customFromBtn: HTMLButtonElement
	let replyToCell: HTMLElement, toCell: HTMLElement, ccCell: HTMLElement, bccCell: HTMLElement // Where we append new address views.
	let toRow: HTMLElement, replyToRow: HTMLElement, ccRow: HTMLElement, bccRow: HTMLElement // We show/hide rows as needed.
	let toViews: AddrView[] = [], replytoViews: AddrView[] = [], ccViews: AddrView[] = [], bccViews: AddrView[] = []
	let forwardAttachmentViews: ForwardAttachmentView[] = []

	// todo future: upload attachments with draft messages. would mean we let users remove them again too.

	// We automatically save drafts 1m after a change. When closing window, we ask to
	// save unsaved change to draft.
	let draftMessageID = opts.draftMessageID || 0
	let draftSaveTimer = 0
	let draftSavePromise = Promise.resolve(0)
	let draftLastText = opts.body

	const draftCancelSaveTimer = () => {
		if (draftSaveTimer) {
			window.clearTimeout(draftSaveTimer)
			draftSaveTimer = 0
		}
	}

	const draftScheduleSave = () => {
		if (draftSaveTimer || body.value === draftLastText) {
			return
		}
		draftSaveTimer = window.setTimeout(async () => {
			draftSaveTimer = 0
			await withStatus(ui("Saving draft"), draftSave())
			draftScheduleSave()
		}, 60*1000)
	}

	const draftSave = async () => {
		draftCancelSaveTimer()
		let replyTo = ''
		if (replytoViews && replytoViews.length === 1 && replytoViews[0].input.value) {
			replyTo = replytoViews[0].input.value
		}
		const cm: api.ComposeMessage = {
			From: customFrom ? customFrom.value : from.value,
			To: toViews.map(v => v.input.value).filter(s => s),
			Cc: ccViews.map(v => v.input.value).filter(s => s),
			Bcc: bccViews.map(v => v.input.value).filter(s => s),
			ReplyTo: replyTo,
			Subject: subject.value,
			TextBody: body.value,
			ResponseMessageID: opts.responseMessageID || 0,
			DraftMessageID: draftMessageID,
		}
		const mbdrafts = listMailboxes().find(mb => mb.Draft)
		if (!mbdrafts) {
			throw new Error(ui("no designated drafts mailbox"))
		}
		draftSavePromise = client.MessageCompose(cm, mbdrafts.ID)
		try {
			draftMessageID = await draftSavePromise
			cv.MsgID = draftMessageID
			setLocationHash() // For ',compose:<number>' suffix.
		} finally {
			draftSavePromise = Promise.resolve(0)
		}
		draftLastText = cm.TextBody
	}

	// todo future: on visibilitychange with visibilityState "hidden", use navigator.sendBeacon to save latest modified draft message?

	// When window is closed, ask user to cancel due to unsaved changes.
	const unsavedChanges = () => opts.body !== body.value && (!draftMessageID || draftLastText !== body.value)

	// In Firefox, ctrl-w doesn't seem interceptable when focus is on a button. It is
	// when focus is on a textarea or not any specific UI element. So this isn't always
	// triggered. But we still have the beforeunload handler that checks for
	// unsavedChanges to protect the user in such cases.
	const cmdClose = async () => {
		draftCancelSaveTimer()
		await draftSavePromise
		if (unsavedChanges()) {
			const action = await new Promise<string>((resolve) => {
				const close = (choice: string) => {
					resolve(choice)
					remove()
				}
				const remove = popup(
					dom.div(
						dom._class('dialogPanel'),
						dom._class('confirmPanel'),
						dom.div(dom._class('dialogHeader'),
							dom.h1(ui("Unsaved changes")),
							dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Keep editing.")), function click() {
								close('cancel')
							}),
						),
						dom.div(dom._class('dialogBody'),
							dom.p(ui("The message has unsaved changes. What would you like to do?")),
						),
						dom.div(dom._class('dialogFooter'),
							dom.clickbutton(ui("Cancel"), function click() {
								close('cancel')
							}),
							dom.clickbutton(ui("Discard changes"), function click() {
								close('discard')
							}),
							draftMessageID ? dom.clickbutton(ui("Remove draft"), function click() {
								close('remove')
							}) : [],
							dom.clickbutton(dom._class('btnPrimary'), ui("Save draft"), function click() {
								close('save')
							}),
						),
					),
				)
			})
			if (action === 'save') {
				await withStatus(ui("Saving draft"), draftSave())
			} else if (action === 'remove') {
				if (draftMessageID) {
					forgetMovedMessages([draftMessageID])
					await withStatus(ui("Removing draft"), client.MessageDelete([draftMessageID]))
				}
			} else if (action === 'cancel') {
				return
			}
		}
		composeElem.remove()
		composeView = null
		setLocationHash()
	}

	const cmdSave = async () => {
		draftCancelSaveTimer()
		await draftSavePromise
		await withStatus(ui("Saving draft"), draftSave())
	}

	const submit = async (archive: boolean) => {
		draftCancelSaveTimer()
		await draftSavePromise

		const files = await new Promise<api.File[]>((resolve, reject) => {
			const l: api.File[] = []
			if (attachments.files && attachments.files.length === 0) {
				resolve(l)
				return
			}
			[...attachments.files!].forEach(f => {
				const fr = new window.FileReader()
				fr.addEventListener('load', () => {
					l.push({Filename: f.name, DataURI: fr.result as string})
					if (attachments.files && l.length === attachments.files.length) {
						resolve(l)
					}
				})
				fr.addEventListener('error', () => {
					reject(fr.error)
				})
				fr.readAsDataURL(f)
			})
		})

		let replyTo = ''
		if (replytoViews && replytoViews.length === 1 && replytoViews[0].input.value) {
			replyTo = replytoViews[0].input.value
		}

		const forwardAttachmentPaths = forwardAttachmentViews.filter(v => v.checkbox.checked).map(v => v.path)

		const message = {
			From: customFrom ? customFrom.value : from.value,
			To: toViews.map(v => v.input.value).filter(s => s),
			Cc: ccViews.map(v => v.input.value).filter(s => s),
			Bcc: bccViews.map(v => v.input.value).filter(s => s),
			ReplyTo: replyTo,
			UserAgent: 'moxwebmail/'+moxversion,
			Subject: subject.value,
			TextBody: body.value,
			Attachments: files,
			ForwardAttachments: forwardAttachmentPaths.length === 0 ? {MessageID: 0, Paths: []} : {MessageID: opts.attachmentsMessageItem!.Message.ID, Paths: forwardAttachmentPaths},
			IsForward: opts.isForward || false,
			ResponseMessageID: opts.responseMessageID || 0,
			RequireTLS: requiretls.value === '' ? null : requiretls.value === 'yes',
			FutureRelease: scheduleTime.value ? new Date(scheduleTime.value) : null,
			ArchiveThread: archive,
			ArchiveReferenceMailboxID: opts.archiveReferenceMailboxID || 0,
			DraftMessageID: draftMessageID,
		}
		await client.MessageSubmit(message)
		composeElem.remove()
		composeView = null
		setLocationHash()
	}

	const cmdSend = async () => {
		await withStatus(ui("Sending email"), submit(false), fieldset)
	}
	const cmdSendArchive = async () => {
		await withStatus(ui("Sending email and archive"), submit(true), fieldset)
	}

	const cmdAddTo = async () => { newAddrView('', true, true, toViews, toBtn, toCell, toRow) }
	const cmdAddCc = async () => { newAddrView('', true, false, ccViews, ccBtn, ccCell, ccRow) }
	const cmdAddBcc = async () => { newAddrView('', true, false, bccViews, bccBtn, bccCell, bccRow) }
	const cmdReplyTo = async () => { newAddrView('', false, false, replytoViews, replyToBtn, replyToCell, replyToRow, true) }
	const cmdCustomFrom = async () => {
		if (customFrom) {
			return
		}
		customFrom = dom.input(attr.value(from.value), attr.required(''), focusPlaceholder(ui("Jane <jane@example.org>")))
		from.replaceWith(customFrom)
		customFromBtn.remove()
	}

	const shortcuts: {[key: string]: command} = {
		'ctrl Enter': cmdSend,
		'ctrl shift Enter': cmdSendArchive,
		'ctrl w': cmdClose,
		'ctrl O': cmdAddTo,
		'ctrl C': cmdAddCc,
		'ctrl B': cmdAddBcc,
		'ctrl Y': cmdReplyTo,
		'ctrl s': cmdSave,
		'ctrl S': cmdClose,
		// ctrl Backspace and ctrl = (+) not included, they are handled by keydown handlers on in the inputs they remove/add.
	}

	const newAddrView = (addr: string, isRecipient: boolean, isTo: boolean, views: AddrView[], btn: HTMLButtonElement, cell: HTMLElement, row: HTMLElement, single?: boolean) => {
		if (single && views.length !== 0) {
			return
		}

		let rcptSecPromise: Promise<api.RecipientSecurity> | null = null
		let rcptSecAddr: string = ''
		let rcptSecAborter: {abort?: () => void} = {}

		let autosizeElem: HTMLElement, inputElem: HTMLInputElement, securityBar: HTMLElement

		const fetchRecipientSecurity = () => {
			if (!accountSettings?.ShowAddressSecurity) {
				return
			}
			if (inputElem.value === rcptSecAddr) {
				return
			}
			securityBar.style.borderImage = ''
			rcptSecAddr = inputElem.value
			if (!inputElem.value) {
				return
			}

			if (rcptSecAborter.abort) {
				rcptSecAborter.abort()
				rcptSecAborter.abort = undefined
			}

			const color = (v: api.SecurityResult) => {
				if (v === api.SecurityResult.SecurityResultYes) {
					return styles.underlineGreen
				} else if (v === api.SecurityResult.SecurityResultNo) {
					return styles.underlineRed
				} else if (v === api.SecurityResult.SecurityResultUnknown) {
					return 'transparent'
				}
				return styles.underlineGrey
			}
			const setBar = (c0: string, c1: string, c2: string, c3: string, c4: string) => {
				const stops = [
					c0 + ' 0%', c0 + ' 19%', 'transparent 19%', 'transparent 20%',
					c1 + ' 20%', c1 + ' 39%', 'transparent 39%', 'transparent 40%',
					c2 + ' 40%', c2 + ' 59%', 'transparent 59%', 'transparent 60%',
					c3 + ' 60%', c3 + ' 79%', 'transparent 79%', 'transparent 80%',
					c4 + ' 80%', c4 + ' 100%',
				].join(', ')
				securityBar.style.borderImage = 'linear-gradient(to right, ' + stops + ') 1'
			}

			const aborter: {abort?: () => void} = {}
			rcptSecAborter = aborter
			rcptSecPromise = client.withOptions({aborter: aborter}).RecipientSecurity(inputElem.value)
			rcptSecPromise.then((rs) => {
				setBar(color(rs.STARTTLS), color(rs.MTASTS), color(rs.DNSSEC), color(rs.DANE), color(rs.RequireTLS))

				const implemented: string[] = []
				const check = (v: boolean, s: string) => {
					if (v) {
						implemented.push(s)
					}
				}
				check(rs.STARTTLS === api.SecurityResult.SecurityResultYes, 'STARTTLS')
				check(rs.MTASTS === api.SecurityResult.SecurityResultYes, 'MTASTS')
				check(rs.DNSSEC === api.SecurityResult.SecurityResultYes, 'DNSSEC')
				check(rs.DANE === api.SecurityResult.SecurityResultYes, 'DANE')
				check(rs.RequireTLS === api.SecurityResult.SecurityResultYes, 'RequireTLS')
				const status = ui('Security mechanisms known to be implemented by the recipient domain: ')+ (implemented.length === 0 ? ui('(none)') : implemented.join(', ')) + '.'
				inputElem.setAttribute('title', status+'\n\n'+recipientSecurityTitle)

				aborter.abort = undefined
				v.recipientSecurity = rs
				if (isRecipient) {
					// If we are not replying to a message from a mailing list, and all recipients
					// implement REQUIRETLS, we enable it.
					let reqtls = opts.isList !== true
					const walk = (l: AddrView[]) => {
						for (const v of l) {
							if (v.recipientSecurity?.RequireTLS !== api.SecurityResult.SecurityResultYes || v.recipientSecurity?.MTASTS !== api.SecurityResult.SecurityResultYes && v.recipientSecurity?.DANE !== api.SecurityResult.SecurityResultYes) {
								reqtls = false
								break
							}
						}
					}
					walk(toViews)
					walk(ccViews)
					walk(bccViews)
					if (requiretls.value === '' || requiretls.value === 'yes') {
						requiretls.value = reqtls ? 'yes' : ''
					}
				}
			}, () => {
				setBar('#888', '#888', '#888', '#888', '#888')
				inputElem.setAttribute('title', ui("Error fetching security mechanisms known to be implemented by the recipient domain...\n\n")+recipientSecurityTitle)
				aborter.abort = undefined
				if (requiretls.value === 'yes') {
					requiretls.value = ''
				}
			})
		}

		const recipientSecurityTitle = ui('Description of security mechanisms recipient domains may implement:\n1. STARTTLS: Opportunistic (unverified) TLS with STARTTLS, successfully negotiated during the most recent delivery attempt.\n2. MTA-STS: For PKIX/WebPKI-verified TLS.\n3. DNSSEC: MX DNS records are DNSSEC-signed.\n4. DANE: First delivery destination host implements DANE for verified TLS.\n5. RequireTLS: SMTP extension for verified TLS delivery into recipient mailbox, support detected during the most recent delivery attempt.\n\nChecks STARTTLS, DANE and RequireTLS cover the most recently used delivery path, not necessarily all possible delivery paths.\n\nThe bars below the input field indicate implementation status by the recipient domain:\n- Red, not implemented/unsupported\n- Green, implemented/supported\n- Gray, error while determining\n- Absent/white, unknown or skipped (e.g. no previous delivery attempt, or DANE check skipped due to DNSSEC-lookup error)')
		const root = dom.span(
			autosizeElem=dom.span(
				dom._class('autosize'),
				inputElem=dom.input(
					focusPlaceholder(ui("Jane <jane@example.org>")),
					style({width: '100%'}),
					attr.value(addr),
					newAddressComplete(),
					accountSettings?.ShowAddressSecurity ? attr.title(recipientSecurityTitle) : [],
					function keydown(e: KeyboardEvent) {
						// Backspace removes address except when it's the only To address left.
						if (e.key === 'Backspace' && e.ctrlKey && inputElem.value === '' && !(isTo && views.length === 1)) {
							remove()
						} else if (e.key === '=' && e.ctrlKey) {
							newAddrView('', isRecipient, isTo, views, btn, cell, row, single)
						} else {
							return
						}
						e.preventDefault()
						e.stopPropagation()
					},
					function input() {
						// data-value is used for size of ::after css pseudo-element to stretch input field.
						autosizeElem.dataset.value = inputElem.value
					},
					function change() {
						autosizeElem.dataset.value = inputElem.value
						fetchRecipientSecurity()
					},
					function paste(e: ClipboardEvent) {
						const data = e.clipboardData?.getData('text/plain')
						if (typeof data !== 'string' || data === '') {
							return
						}
						const split = data.split(',')
						if (split.length <= 1) {
							return
						}
						autosizeElem.dataset.value = inputElem.value = split[0]
						let last
						for (const rest of split.splice(1)) {
							last = newAddrView(rest.trim(), isRecipient, isTo, views, btn, cell, row, single)
						}
						last!!.input.focus()
						e.preventDefault()
						e.stopPropagation()
					},
				),
				securityBar=dom.span(
					css('securitybar', {
						margin: '0 1px',
						borderBottom: '1.5px solid',
						borderBottomColor: 'transparent',
					}),
				),
			),
			dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.minus), attr.arialabel(ui("Remove address.")), attr.title(ui("Remove address.")), function click() {
				remove()
				if (single && views.length === 0) {
					btn.style.display = ''
				}
			}),
		)
		autosizeElem.dataset.value = inputElem.value

		const remove = () => {
			const i = views.indexOf(v)
			views.splice(i, 1)
			root.remove()
			if (views.length === 0) {
				row.style.display = 'none'
			}
			if (views.length === 0 && single) {
				btn.style.display = ''
			}

			let next = cell.querySelector('input')
			if (!next) {
				let tr = row!.nextSibling as Element
				while (tr) {
					next = tr.querySelector('input')
					if (!next && tr.nextSibling) {
						tr = tr.nextSibling as Element
						continue
					}
					break
				}
			}
			if (next) {
				next.focus()
			}
		}

		const v: AddrView = {root: root, input: inputElem, isRecipient: isRecipient, recipientSecurity: null}

		fetchRecipientSecurity()

		views.push(v)
		cell.appendChild(v.root)
		row.style.display = ''
		if (single) {
			btn.style.display = 'none'
		}
		inputElem.focus()
		return v
	}

	let noAttachmentsWarning: HTMLElement
	const checkAttachments = () => {
		const missingAttachments = !attachments.files?.length && !forwardAttachmentViews.find(v => v.checkbox.checked) && !!body.value.split('\n').find(s => !s.startsWith('>') && s.match(/attach(ed|ment)/))
		noAttachmentsWarning.style.display = missingAttachments ? '' : 'none'
	}

	const normalizeUser = (a: api.MessageAddress) => {
		let user = a.User
		const domconf = domainAddressConfigs[a.Domain.ASCII]
		for (const sep of (domconf.LocalpartCatchallSeparators || [])) {
			user = user.split(sep)[0]
		}
		const localpartCaseSensitive = domconf.LocalpartCaseSensitive
		if (!localpartCaseSensitive) {
			user = user.toLowerCase()
		}
		return user
	}
	// Find own address matching the specified address, taking wildcards, localpart
	// separators and case-sensitivity into account.
	const addressSelf = (addr: api.MessageAddress) => {
		return accountAddresses.find(a => a.Domain.ASCII === addr.Domain.ASCII && (a.User === '' || normalizeUser(a) === normalizeUser(addr)))
	}

	let haveFrom = false
	const fromOptions = accountAddresses.filter(a => a.User).map(a => {
		const selected = opts.from && opts.from.length === 1 && equalAddress(a, opts.from[0]) || loginAddress && equalAddress(a, loginAddress) && (!opts.from || envelopeIdentity(opts.from))
		const o = dom.option(formatAddress(a), selected ? attr.selected('') : [])
		if (selected) {
			haveFrom = true
		}
		return o
	})
	if (!haveFrom && opts.from && opts.from.length === 1) {
		const a = addressSelf(opts.from[0])
		if (a) {
			const fromAddr: api.MessageAddress = {Name: a.Name, User: opts.from[0].User, Domain: a.Domain}
			const o = dom.option(formatAddress(fromAddr), attr.selected(''))
			fromOptions.unshift(o)
		}
	}

	let scheduleLink: HTMLElement
	let scheduleElem: HTMLElement
	let scheduleTime: HTMLInputElement
	let scheduleWeekday: HTMLElement
	const pad0 = (v: number) => v >= 10 ? ''+v : '0'+v
	const localdate = (d: Date) => [d.getFullYear(), pad0(d.getMonth()+1), pad0(d.getDate())].join('-')
	const localdatetime = (d: Date) => localdate(d) + 'T' + pad0(d.getHours()) + ':' + pad0(d.getMinutes()) + ':00'
	const scheduleTimeChanged = () => {
		log('datetime change', scheduleTime.value)
		const d = new Date(scheduleTime.value)
		dom._kids(scheduleWeekday, Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString(uiLocale(), {weekday: 'long'}))
	}

	let resizeLast: {x: number, y: number} | null = null
	let resizeTimer: number = 0
	const initWidth = window.innerWidth === settings.composeViewportWidth ? settings.composeWidth : 0
	const initHeight = window.innerHeight === settings.composeViewportHeight ? settings.composeHeight : 0

	const composeTextMildStyle = css('composeTextMild', {textAlign: 'right', color: styles.colorMild})
	const composeCellStyle = css('composeCell', {lineHeight: '1.5'})

	const composeElem = dom.div(
		css('composePopup', {
			position: 'fixed',
			bottom: '1ex',
			right: '1ex',
			zIndex: zindexes.compose,
			backgroundColor: styles.popupBackgroundColor,
			boxShadow: styles.floatShadow,
			border: '1px solid',
			borderColor: styles.floatBorderColor,
			width: 'min(42em, calc(100vw - 2rem))',
			minWidth: '0',
			maxWidth: 'calc(100vw - 2rem)',
			borderRadius: styles.radius,
			display: 'flex',
			flexDirection: 'column',
		}),
		isMobile() ? dom._class('composePopupMobile') : [],
		isMobile() ? [] : (initWidth ? style({width: initWidth+'px'}) : []),
		isMobile() ? [] : (initHeight ? style({height: initHeight+'px'}) : []),
		dom.div(
			css('composeResizeGrab', {position: 'absolute', marginTop: '-1em', marginLeft: '-1em', width: '1em', height: '1em', cursor: 'nw-resize'}),
			async function mousedown(e: MouseEvent) {
				// Disable pointer events on the message view. If it has an iframe with a message,
				// mouse events while dragging would be consumed by the iframe, breaking our
				// resize.
				page.style.pointerEvents = 'none'
				resizeLast = null
				await startDrag(e, (e: MouseEvent) => {
					if (resizeLast) {
						const bounds = composeElem.getBoundingClientRect()
						const width = Math.round(bounds.width + resizeLast.x - e.clientX)
						const height = Math.round(bounds.height + resizeLast.y - e.clientY)
						composeElem.style.width = width+'px'
						composeElem.style.height = height+'px'
						body.removeAttribute('rows')
						if (resizeTimer) {
							window.clearTimeout(resizeTimer)
						}
						resizeTimer = window.setTimeout(() => {
							settingsPut({...settings, composeWidth: width, composeHeight: height, composeViewportWidth: window.innerWidth, composeViewportHeight: window.innerHeight})
						}, 1000)
					}
					resizeLast = {x: e.clientX, y: e.clientY}
				})
				page.style.pointerEvents = ''
			},
		),
		dom.form(
			css('composeForm', {
				flexGrow: '1',
				display: 'flex',
				flexDirection: 'column',
			}),
			fieldset=dom.fieldset(
				css('composeFields', {
					flexGrow: '1',
					display: 'flex',
					flexDirection: 'column',
				}),
				dom.table(
					style({width: '100%'}),
					dom.tr(dom._class('composeHeaderRow'),
						dom.td(attr.colspan('2'),
							dom.div(dom._class('composeFromBar'),
								dom.label(dom._class('composeFromLabel'), ui('From'),
									from=dom.select(
										attr.required(''),
										fromOptions,
									),
								),
								dom.div(dom._class('composeHeaderActions'),
									listMailboxes().find(mb => mb.Draft) ? [
										dom.clickbutton(ui("Save"), attr.title(ui("Save draft message.")), clickCmd(cmdSave, shortcuts)),
									] : [],
									dom.clickbutton(ui("Close"), attr.title(ui("Close window, saving draft message if body has changed or a draft was saved earlier.")), clickCmd(cmdClose, shortcuts)),
								),
							),
						),
					),
					dom.tr(dom._class('composeToolbarRow'),
						dom.td(attr.colspan('2'),
							dom.div(dom._class('composeToolbarBtns'),
								toBtn=dom.clickbutton(ui("To"), clickCmd(cmdAddTo, shortcuts)),
								ccBtn=dom.clickbutton(ui("Cc"), clickCmd(cmdAddCc, shortcuts)),
								bccBtn=dom.clickbutton(ui("Bcc"), clickCmd(cmdAddBcc, shortcuts)),
								replyToBtn=dom.clickbutton(ui("Reply-To"), clickCmd(cmdReplyTo, shortcuts)),
								customFromBtn=dom.clickbutton(ui("Custom From"), attr.title(ui("Set custom From address/name.")), clickCmd(cmdCustomFrom, shortcuts)),
							),
						),
					),
					toRow=dom.tr(dom._class('composeAddrRow'),
						dom.td(ui("To:"), composeTextMildStyle),
						toCell=dom.td(composeCellStyle),
					),
					replyToRow=dom.tr(dom._class('composeAddrRow'),
						dom.td(ui("Reply-To:"), composeTextMildStyle),
						replyToCell=dom.td(composeCellStyle),
					),
					ccRow=dom.tr(dom._class('composeAddrRow'),
						dom.td(ui("Cc:"), composeTextMildStyle),
						ccCell=dom.td(composeCellStyle),
					),
					bccRow=dom.tr(dom._class('composeAddrRow'),
						dom.td(ui("Bcc:"), composeTextMildStyle),
						bccCell=dom.td(composeCellStyle),
					),
					dom.tr(dom._class('composeSubjectRow'),
						dom.td(ui("Subject:"), composeTextMildStyle),
						dom.td(
							subjectAutosize=dom.span(
								dom._class('autosize'),
								style({width: '100%'}), // Without 100% width, the span takes minimal width for input, we want the full table cell.
								subject=dom.input(
									style({width: '100%'}),
									attr.value(opts.subject || ''),
									attr.required(''),
									focusPlaceholder(ui("subject...")),
									function input() {
										subjectAutosize.dataset.value = subject.value
									},
								),
							),
						),
					),
				),
				body=dom.textarea(
					dom._class('mono'),
					style({
						flexGrow: '1',
						width: '100%',
					}),
					initHeight === 0 ? attr.rows('15') : [], // Drives default size, removed on compose window resize.
					// Explicit string object so it doesn't get the highlight-unicode-block-changes
					// treatment, which would cause characters to disappear.
					new String(opts.body || ''),
					prop({selectionStart: opts.editOffset || 0, selectionEnd: opts.editOffset || 0}),
					function keyup(e: KeyboardEvent) {
						if (e.key === 'Enter') {
							checkAttachments()
						}
					},
					!listMailboxes().find(mb => mb.Draft) ? [] : function input() {
						draftScheduleSave()
					},
				),
				dom.div(dom._class('composeMeta'),
					!(opts.attachmentsMessageItem && opts.attachmentsMessageItem.Attachments && opts.attachmentsMessageItem.Attachments.length > 0) ? [] : dom.div(
						ui("Forward attachments: "),
						forwardAttachmentViews=(opts.attachmentsMessageItem?.Attachments || []).map(a => {
							const filename = a.Filename || ui('(unnamed)')
							const size = formatSize(a.Part.DecodedSize)
							const checkbox = dom.input(attr.type('checkbox'), function change() { checkAttachments() })
							const root = dom.label(checkbox, ' '+filename+' ', dom.span('('+size+') ', styleClasses.textMild))
							const v: ForwardAttachmentView = {
								path: a.Path || [],
								root: root,
								checkbox: checkbox
							}
							return v
						}),
						dom.label(styleClasses.textMild, dom.input(attr.type('checkbox'), function change(e: Event) {
							forwardAttachmentViews.forEach(v => v.checkbox.checked = (e.target! as HTMLInputElement).checked)
						}), ui(" (Toggle all)"))
					),
					noAttachmentsWarning=dom.div(style({display: 'none'}), css('composeNoAttachmentsWarning', {backgroundColor: styles.warningBackgroundColor, padding: '0.35em .5em', borderRadius: styles.radius}), ui("Message mentions attachments, but no files are attached.")),
					dom.label(ui("Attachments "), attachments=dom.input(attr.type('file'), attr.multiple(''), function change() { checkAttachments() })),
					dom.label(
						attr.title(ui("How to use TLS for message delivery over SMTP:\n\nDefault: Delivery attempts follow the policies published by the recipient domain: Verification with MTA-STS and/or DANE, or optional opportunistic unverified STARTTLS if the domain does not specify a policy.\n\nWith RequireTLS: For sensitive messages, you may want to require verified TLS. The recipient destination domain SMTP server must support the REQUIRETLS SMTP extension for delivery to succeed. It is automatically chosen when the destination domain mail servers of all recipients are known to support it.\n\nFallback to insecure: If delivery fails due to MTA-STS and/or DANE policies specified by the recipient domain, and the content is not sensitive, you may choose to ignore the recipient domain TLS policies so delivery can succeed.")),
						ui("TLS "),
						requiretls=dom.select(
							dom.option(attr.value(''), ui("Default")),
							dom.option(attr.value('yes'), ui("With RequireTLS")),
							dom.option(attr.value('no'), ui("Fallback to insecure")),
						),
					),
					dom.div(
						scheduleLink=dom.a(attr.href(''), ui('Schedule'), function click(e: MouseEvent) {
							e.preventDefault()
							scheduleTime.value = localdatetime(new Date())
							scheduleTimeChanged()
							scheduleLink.style.display = 'none'
							scheduleElem.style.display = ''
							scheduleTime.setAttribute('required', '')
						}),
						scheduleElem=dom.div(
							style({display: 'none'}),
							dom.div(dom._class('composeSchedulePresets'),
								dom.clickbutton(ui("Start of next day"), function click(e: MouseEvent) {
									e.preventDefault()
									const d = new Date(scheduleTime.value)
									const nextday = new Date(d.getTime() + 24*3600*1000)
									scheduleTime.value = localdate(nextday) + 'T09:00:00'
									scheduleTimeChanged()
								}),
								dom.clickbutton(ui("+1 hour"), function click(e: MouseEvent) {
									e.preventDefault()
									const d = new Date(scheduleTime.value)
									scheduleTime.value = localdatetime(new Date(d.getTime() + 3600*1000))
									scheduleTimeChanged()
								}),
								dom.clickbutton(ui("+1 day"), function click(e: MouseEvent) {
									e.preventDefault()
									const d = new Date(scheduleTime.value)
									scheduleTime.value = localdatetime(new Date(d.getTime() + 24*3600*1000))
									scheduleTimeChanged()
								}),
								dom.clickbutton(ui("Now"), function click(e: MouseEvent) {
									e.preventDefault()
									scheduleTime.value = localdatetime(new Date())
									scheduleTimeChanged()
								}),
								dom.clickbutton(ui("Cancel"), function click(e: MouseEvent) {
									e.preventDefault()
									scheduleLink.style.display = ''
									scheduleElem.style.display = 'none'
									scheduleTime.removeAttribute('required')
									scheduleTime.value = ''
								}),
							),
							dom.div(
								scheduleTime=dom.input(attr.type('datetime-local'), function change() {
									scheduleTimeChanged()
								}),
								ui(" in local timezone ") + (Intl.DateTimeFormat().resolvedOptions().timeZone || '') + ', ',
								scheduleWeekday=dom.span(),
							),
						),
					),
				),
			),
			dom.div(dom._class('composeFooter'),
				opts.responseMessageID && listMailboxes().find(mb => mb.Archive) ? dom.clickbutton(ui("Send and archive"), clickCmd(cmdSendArchive, shortcuts)) : [],
				dom.submitbutton(dom._class('btnPrimary'), ui("Send")),
			),
			async function submit(e: SubmitEvent) {
				e.preventDefault()
				shortcutCmd(cmdSend, shortcuts)
			},
		),
	)

	subjectAutosize.dataset.value = subject.value

	;(opts.to && opts.to.length > 0 ? opts.to : ['']).forEach(s => newAddrView(s, true, true, toViews, toBtn, toCell, toRow))
	;(opts.cc || []).forEach(s => newAddrView(s, true,  false, ccViews, ccBtn, ccCell, ccRow))
	;(opts.bcc || []).forEach(s => newAddrView(s, true, false, bccViews, bccBtn, bccCell, bccRow))
	if (opts.replyto) {
		newAddrView(opts.replyto, false, false, replytoViews, replyToBtn, replyToCell, replyToRow, true)
	}
	if (!opts.cc || !opts.cc.length) {
		ccRow.style.display = 'none'
	}
	if (!opts.bcc || !opts.bcc.length) {
		bccRow.style.display = 'none'
	}
	if (!opts.replyto) {
		replyToRow.style.display = 'none'
	}

	clearMoveUndo()
	document.body.appendChild(composeElem)
	if (toViews.length > 0 && !toViews[0].input.value) {
		toViews[0].input.focus()
	} else {
		body.focus()
	}

	const cv = {
		root: composeElem,
		MsgID: draftMessageID,
		key: keyHandler(shortcuts),
		unsavedChanges: unsavedChanges,
		save: cmdSave,
	}
	composeView = cv
	setLocationHash()
}

const composeDraft = async (mi: api.MessageItem, pm: api.ParsedMessage, listMailboxes: listMailboxes, setLocationHash: setLocationHash) => {
	const m = mi.Message
	const draftMailboxID = listMailboxes().find(mb => mb.Draft)?.ID

	if (m.MailboxID !== draftMailboxID) {
		throw new Error(ui("only messages in draft mailbox can be edited"))
	}

	// Compose based on message. Most information is available, we just need to find
	// the ID of the stored message this is a reply/forward to, based in In-Reply-To
	// header.
	const env = mi.Envelope
	let refMsgID = 0
	if (env.InReplyTo) {
		refMsgID = await withStatus(ui("Looking up referenced message"), client.MessageFindMessageID(env.InReplyTo))
	}

	const isForward = !!env.Subject.match(/^\[?fwd?:/i) || !!env.Subject.match(/\(fwd\)[ \t]*$/i)
	const opts: ComposeOptions = {
		from: (env.From || []),
		to: (env.To || []).map(a => formatAddress(a)),
		cc: (env.CC || []).map(a => formatAddress(a)),
		bcc: (env.BCC || []).map(a => formatAddress(a)),
		replyto: env.ReplyTo && env.ReplyTo.length > 0 ? formatAddress(env.ReplyTo[0]) : '',
		subject: env.Subject,
		isForward: isForward,
		body: pm.Texts && pm.Texts.length > 0 ? pm.Texts[0].replace(/\r/g, '') : '',
		responseMessageID: refMsgID,
		draftMessageID: m.ID,
	}
	compose(opts, listMailboxes, setLocationHash)
}

// Show popover to edit labels for msgs.
const labelsPopover = (e: MouseEvent, msgs: api.Message[], possibleLabels: possibleLabels): void => {
	if (msgs.length === 0) {
		return // Should not happen.
	}

	const knownLabels = possibleLabels()
	const activeLabels = (msgs[0].Keywords || []).filter(kw => msgs.filter(m => (m.Keywords || []).includes(kw)).length === msgs.length)
	const msgIDs = msgs.map(m => m.ID)
	let fieldsetnew: HTMLFieldSetElement
	let newlabel: HTMLInputElement

	const remove = popover(e.target! as HTMLElement, {transparent: true},
		dom.div(dom._class('menuList'),
			...knownLabels.map(l =>
				dom.div(dom._class('menuItem'),
					dom.label(
						dom.input(
							attr.type('checkbox'),
							activeLabels.includes(l) ? attr.checked('') : [],
							attr.title(ui("Add/remove this label to the message(s), leaving other labels unchanged.")),
							async function change(e: Event) {
								const input = e.target as HTMLInputElement
								if (input.checked) {
									await withStatus(ui("Adding label"), client.FlagsAdd(msgIDs, [l]), input)
									if (!activeLabels.includes(l)) {
										activeLabels.push(l)
									}
								} else {
									await withStatus(ui("Removing label"), client.FlagsClear(msgIDs, [l]), input)
									const i = activeLabels.indexOf(l)
									if (i >= 0) {
										activeLabels.splice(i, 1)
									}
								}
							},
						),
						dom.span(styleClasses.keyword, l),
					),
				)
			),
			dom.div(dom._class('menuItem'), dom._class('menuItemForm'),
				dom.form(
					async function submit(e: SubmitEvent) {
						e.preventDefault()
						await withStatus(ui("Adding new label"), client.FlagsAdd(msgIDs, [newlabel.value]), fieldsetnew)
						remove()
					},
					fieldsetnew=dom.fieldset(
						dom.div(style({display: 'flex', gap: '6px', flexWrap: 'wrap'}),
							newlabel=dom.input(focusPlaceholder(ui("new-label")), attr.required(''), style({flex: '1 1 8em', minWidth: 0}), attr.title(ui('New label to add/set on the message(s), must be lower-case, ascii-only, without spaces and without the following special characters: (){%*"\\].'))),
							dom.submitbutton(ui("Add new label"), attr.title(ui("Add this label to the message(s), leaving other labels unchanged."))),
						),
					),
				),
			),
		),
	)
}

// Show popover to move messages to a mailbox.
const movePopover = (e: MouseEvent, mailboxes: api.Mailbox[], msgs: api.Message[]) => {
	if (msgs.length === 0) {
		return // Should not happen.
	}
	let msgsMailboxID = (msgs[0].MailboxID && msgs.filter(m => m.MailboxID === msgs[0].MailboxID).length === msgs.length) ? msgs[0].MailboxID : 0

	const remove = menuPopover(e.target! as HTMLElement,
		mailboxes.map(mb =>
			dom.clickbutton(
				mailboxLabel(mb, mb.Name),
				mb.ID === msgsMailboxID ? attr.disabled('') : [],
				async function click() {
					const moveMsgs = msgs.filter(m => m.MailboxID !== mb.ID)
					const msgIDs = moveMsgs.map(m => m.ID)
					await withStatus(ui("Moving to mailbox"), client.MessageMove(msgIDs, mb.ID, false))
					offerMoveUndo(moveMsgs.map(m => ({ id: m.ID, mailboxID: m.MailboxID })))
					if (moveMsgs.length === 1) {
						await moveAskRuleset(moveMsgs[0].ID, moveMsgs[0].MailboxID, mb, mailboxes)
					}
					remove()
				}
			)
		),
	)
}

// We've moved a single message. If the source or destination mailbox is not a
// "special-use" mailbox (other than inbox), and there isn't a rule yet or there is
// one we may want to delete, and we haven't asked about adding/removing this
// ruleset before, ask the user to add/remove a ruleset for moving. If the message
// has a list-id header, we ask to create a ruleset treating it as a mailing list
// message matching on future list-id header and spf/dkim verified domain,
// otherwise we make a rule based on message "from" address.
const moveAskRuleset = async (msgID: number, mbSrcID: number, mbDst: api.Mailbox, mailboxes: api.Mailbox[]) => {
	const mbSrc = mailboxes.find(mb => mb.ID === mbSrcID)
	if (!mbSrc || isSpecialUse(mbDst) || isSpecialUse(mbSrc)) {
		return
	}

	const [listID, msgFrom, isRemove, rcptTo, ruleset] = await withStatus(ui("Checking rulesets"), client.RulesetSuggestMove(msgID, mbSrc.ID, mbDst.ID))
	if (!ruleset) {
		return
	}

	const what = listID ? ['list with id "', listID, '"'] : ['address "', msgFrom, '"']

	if (isRemove) {
		const remove = popup(
			dom.div(
				dom._class('dialogPanel'),
				dom._class('confirmPanel'),
				dom.div(dom._class('dialogHeader'),
					dom.h1(ui("Remove rule?")),
					dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close without removing rule.")), function click() {
						remove()
					}),
				),
				dom.div(dom._class('dialogBody'),
					dom.p(ui("Would you like to remove the server-side rule that automatically delivers messages from "), what, ui(" to mailbox \""), mailboxLabel(mbDst, mbDst.Name), '"?'),
					dom.div(dom._class('dialogActionsStack'),
						dom.clickbutton(ui("No, and don't ask again for "), what, async function click() {
							await withStatus(ui("Store ruleset response"), client.RulesetMessageNever(rcptTo, listID, msgFrom, true))
							remove()
						}),
						dom.clickbutton(ui("No, and don't ask again when moving messages out of \""), mailboxLabel(mbSrc, mbSrc.Name), '"', async function click() {
							await withStatus(ui("Store ruleset response"), client.RulesetMailboxNever(mbSrc.ID, false))
							remove()
						}),
					),
				),
				dom.div(dom._class('dialogFooter'),
					dom.clickbutton(ui("Not now"), function click() {
						remove()
					}),
					dom.clickbutton(dom._class('btnPrimary'), ui("Yes, remove rule"), async function click() {
						await withStatus(ui("Remove ruleset"), client.RulesetRemove(rcptTo, ruleset))
						remove()
					}),
				),
			),
		)
		return
	}
	const remove = popup(
		dom.div(
			dom._class('dialogPanel'),
			dom._class('confirmPanel'),
			dom.div(dom._class('dialogHeader'),
				dom.h1(ui("Add rule?")),
				dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close without adding rule.")), function click() {
					remove()
				}),
			),
			dom.div(dom._class('dialogBody'),
				dom.p(ui("Would you like to create a server-side ruleset that automatically delivers future messages from "), what, ui(" to mailbox \""), mailboxLabel(mbDst, mbDst.Name), '"?'),
				dom.div(dom._class('dialogActionsStack'),
					dom.clickbutton(ui("No, and don't ask again for "), what, async function click() {
						await withStatus(ui("Store ruleset response"), client.RulesetMessageNever(rcptTo, listID, msgFrom, false))
						remove()
					}),
					dom.clickbutton(ui("No, and don't ask again when moving messages to \""), mailboxLabel(mbDst, mbDst.Name), '"', async function click() {
						await withStatus(ui("Store ruleset response"), client.RulesetMailboxNever(mbDst.ID, true))
						remove()
					}),
				),
			),
			dom.div(dom._class('dialogFooter'),
				dom.clickbutton(ui("Not now"), function click() {
					remove()
				}),
				dom.clickbutton(dom._class('btnPrimary'), ui("Yes, add rule"), async function click() {
					await withStatus(ui("Add ruleset"), client.RulesetAdd(rcptTo, ruleset))
					remove()
				}),
			),
		),
	)
}

const isSpecialUse = (mb: api.Mailbox) => mb.Archive || mb.Draft || mb.Junk || mb.Sent || mb.Trash

// MsgitemView is a message-line in the list of messages. Selecting it loads and displays the message, a MsgView.
interface MsgitemView {
	root: HTMLElement // MsglistView toggles active/focus classes on the root element.
	messageitem: api.MessageItem // Can be replaced with an updated version, e.g. with message with different mailbox.

	// Fields for threading.
	//
	// Effective received time. When sorting ascending, the oldest of all children.
	// When sorting descending, the newest of all. Does not change after creating
	// MsgitemView, we don't move threads around when a new message is delivered to a
	// thread.
	receivedTime: number
	// Parent message in thread. May not be the direct replied/forwarded message, e.g.
	// if the direct parent was permanently removed. Thread roots don't have a parent.
	parent: MsgitemView | null
	// Sub messages in thread. Can be further descendants, when an intermediate message
	// is missing.
	kids: MsgitemView[]
	// Whether this thread root is collapsed. If so, the root is visible, all descendants
	// are not. Value is only valid if this is a thread root.
	collapsed: boolean

	// Root MsgitemView for this subtree. Does not necessarily contain all messages in
	// a thread, there can be multiple visible roots. A MsgitemView is visible if it is
	// the threadRoot or otherwise if its threadRoot isn't collapsed.
	threadRoot: () => MsgitemView
	isCollapsedThreadRoot: () => boolean
	descendants: () => MsgitemView[] // Flattened list of all descendants.
	findDescendant: (match: (dmiv: MsgitemView) => boolean) => MsgitemView | null
	lastDescendant: () => MsgitemView | null

	// Removes msgitem from the DOM and cleans up the timer that updates the message
	// age. Must be called when MsgitemView is no longer needed. Typically through
	// msglistView.clear().
	remove: () => void

	// Must be called after initializing kids/parent field for proper rendering.
	render: () => void
}

// Make new MsgitemView, to be added to the list.
const newMsgitemView = (mi: api.MessageItem, msglistView: MsglistView, otherMailbox: otherMailbox, listMailboxes: listMailboxes, receivedTime: number, initialCollapsed: boolean): MsgitemView => {
	// note: mi may be replaced.

	// Timer to update the age of the message.
	let ageTimer = 0

	// Show with a tag if we are in the cc/bcc headers, or - if none.
	const identityTag = (s: string, title: string) =>
		dom.span(
			css('msgItemIdentity', {padding: '2px 8px', marginLeft: '.15em', borderRadius: '20px', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap', backgroundColor: styles.accentSoft, color: styles.accent, border: '1px solid', borderColor: styles.borderColor}),
			s,
			attr.title(title),
		)
	const identityHeader: HTMLElement[] = []
	if (!envelopeIdentity(mi.Envelope.From || []) && !envelopeIdentity(mi.Envelope.To || [])) {
		if (envelopeIdentity(mi.Envelope.CC || [])) {
			identityHeader.push(identityTag('cc', ui("You are in the CC header")))
		}
		if (envelopeIdentity(mi.Envelope.BCC || [])) {
			identityHeader.push(identityTag('bcc', ui("You are in the BCC header")))
		}
		// todo: don't include this if this is a message to a mailing list, based on list-* headers.
		if (identityHeader.length === 0) {
			identityHeader.push(identityTag('-', ui("You are not in any To, From, CC, BCC header. Could message to a mailing list or Bcc without Bcc message header.")))
		}
	}

	const remove = (): void => {
		msgitemView.root.remove()
		if (ageTimer) {
			window.clearTimeout(ageTimer)
			ageTimer = 0
		}
	}

	const age = (date: Date): HTMLElement => {
		const r = dom.span(dom._class('notooltip'), attr.title(date.toLocaleString(uiLocale())))

		const set = () => {
			const nowSecs = new Date().getTime()/1000
			let t = nowSecs - date.getTime()/1000
			let negative = ''
			if (t < 0) {
				negative = '-'
				t = -t
			}
			const minute = 60
			const hour = 60*minute
			const day = 24*hour
			const month = 30*day
			const year = 365*day
			const periods = [year, month, day, hour, minute]
			const suffix = [ui('y'), ui("mo"), ui("d"), ui("h"), ui("min")]
			let s
			let nextSecs = 0
			for (let i = 0; i < periods.length; i++) {
				const p = periods[i]
				if (t >= 2*p || i === periods.length-1) {
					const n = Math.round(t/p)
					s = '' + n + suffix[i]
					const prev = Math.floor(t/p)
					nextSecs = Math.ceil((prev+1)*p - t)
					break
				}
			}
			if (t < 60) {
				s = ui('<1min')
				nextSecs = 60-t
				// Prevent showing '-<1min' when browser and server have relatively small time drift of max 1 minute.
				negative = ''
			}

			dom._kids(r, negative+s)
			// note: Cannot have delays longer than 24.8 days due to storage as 32 bit in
			// browsers. Session is likely closed/reloaded/refreshed before that time anyway.
			if (nextSecs < 14*24*3600) {
				ageTimer = window.setTimeout(set, nextSecs*1000)
			} else {
				ageTimer = 0
			}
		}

		set()
		return r
	}

	const render = () => {
		const mi = msgitemView.messageitem
		const m = mi.Message

		// Set by calling age().
		if (ageTimer) {
			window.clearTimeout(ageTimer)
			ageTimer = 0
		}

		// Keywords are normally shown per message. For collapsed threads, we show the
		// keywords of the thread root message as normal, and any additional keywords from
		// children in a way that draws less attention.
		const keywords = (m.Keywords || []).map(kw => dom.span(styleClasses.keyword, kw))
		if (msgitemView.isCollapsedThreadRoot()) {
			const keywordsSeen = new Set<string>()
			for (const kw of (m.Keywords || [])) {
				keywordsSeen.add(kw)
			}
			for (const miv of msgitemView.descendants()) {
				for (const kw of (miv.messageitem.Message.Keywords || [])) {
					if (!keywordsSeen.has(kw)) {
						keywordsSeen.add(kw)
						keywords.push(dom.span(styleClasses.keyword, dom._class('keywordCollapsed'), kw))
					}
				}
			}
		}

		let threadIndent = 0
		for (let miv = msgitemView; miv.parent; miv = miv.parent) {
			threadIndent++
		}

		// For threaded messages, we draw the subject/first-line indented, and with a
		// character indicating the relationship.
		// todo: show different arrow is message is a forward? we can tell by the message flag, it will likely be a message the user sent.
		let threadChar = ''
		let threadCharTitle = ''
		if (msgitemView.parent) {
			threadChar = '↳' // Down-right arrow for direct response (reply/forward).
			if (msgitemView.parent.messageitem.Message.MessageID === mi.Message.MessageID) {
				// Approximately equal, for duplicate message-id, typically in Sent and incoming
				// from mailing list or when sending to self.
				threadChar = '≈'
				threadCharTitle = ui('Same Message-ID.')
			} else if (mi.Message.ThreadMissingLink || (mi.Message.ThreadParentIDs || []).length > 0 && (mi.Message.ThreadParentIDs || [])[0] !== msgitemView.parent.messageitem.Message.ID) {
				// Zigzag arrow, e.g. if immediate parent is missing, or when matching was done
				// based on subject.
				threadChar = '↯'
				threadCharTitle = ui('Immediate parent message is missing.')
			}
		}

		// Message is unread if it itself is unread, or it is collapsed and has an unread child message.
		const isUnread = () => !mi.Message.Seen || msgitemView.isCollapsedThreadRoot() && !!msgitemView.findDescendant(miv => !miv.messageitem.Message.Seen)

		const isRelevant = () => !mi.Message.ThreadMuted && mi.MatchQuery || (msgitemView.isCollapsedThreadRoot() && msgitemView.findDescendant(miv => !miv.messageitem.Message.ThreadMuted && miv.messageitem.MatchQuery))

		// Effective receive time to display. For collapsed thread roots, we show the time
		// of the newest or oldest message, depending on whether you're viewing
		// newest-first or oldest-first messages.
		const received = () => {
			let r = mi.Message.Received
			if (!msgitemView.isCollapsedThreadRoot()) {
				return r
			}
			msgitemView.descendants().forEach(dmiv => {
				if (settings.orderAsc && dmiv.messageitem.Message.Received.getTime() < r.getTime()) {
					r = dmiv.messageitem.Message.Received
				} else if (!settings.orderAsc && dmiv.messageitem.Message.Received.getTime() > r.getTime()) {
					r = dmiv.messageitem.Message.Received
				}
			})
			return r
		}

		// For drawing half a thread bar for the last message in the thread.
		const isThreadLast = () => {
			let miv = msgitemView.threadRoot()
			while (miv.kids.length > 0) {
				miv = miv.kids[miv.kids.length-1]
			}
			return miv === msgitemView
		}

		// If mailbox of message is not specified in filter (i.e. for a regular mailbox
		// view, or search on a mailbox), we show it on the right-side of the subject. For
		// collapsed thread roots, we show all additional mailboxes of descendants with
		// different style.
		const mailboxtags: HTMLElement[] = []
		const mailboxIDs = new Set<number>()
		const addMailboxTag = (mb: api.Mailbox, isCollapsedKid: boolean) => {
			const full = mailboxLabel(mb, mb.Name)
			let name = full
			mailboxIDs.add(mb.ID)
			if (name.length > 8+1+3+1+8+4) {
				const t = name.split('/')
				const first = t[0]
				const last = t[t.length-1]
				if (first.length + last.length <= 8+8) {
					name = first+'/.../'+last
				} else {
					name = first.substring(0, 8) + '/.../' + last.substring(0, 8)
				}
			}
			const e = dom.span(
				css('msgItemMailbox', {padding: '2px 8px', marginLeft: '.15em', borderRadius: '20px', fontWeight: '600', fontSize: '11px', whiteSpace: 'nowrap', background: styles.accentSoft, color: styles.accent, border: '1px solid', borderColor: styles.borderColor}),
				isCollapsedKid ? css('msgItemMailboxCollapsed', {background: styles.accentSoft, color: styles.colorMild}, true) : [],
				name === full ? [] : attr.title(full),
				name,
			)
			mailboxtags.push(e)
		}
		const othermb = otherMailbox(m.MailboxID)
		if (othermb) {
			addMailboxTag(othermb, false)
		}
		if (msgitemView.isCollapsedThreadRoot()) {
			for (const miv of msgitemView.descendants()) {
				const m = miv.messageitem.Message
				if (!mailboxIDs.has(m.MailboxID) && otherMailbox(m.MailboxID)) {
					const mb = listMailboxes().find(mb => mb.ID === m.MailboxID)
					if (!mb) {
						throw new ConsistencyError(ui("missing mailbox for message in thread"))
					}
					addMailboxTag(mb, true)
				}
			}
		}

		const correspondentAddrs = (miv: MsgitemView): [api.MessageAddress[], api.MessageAddress[]] => {
			let fromAddrs = miv.messageitem.Envelope.From || []
			let toAddrs: api.MessageAddress[] = []
			if (listMailboxes().find(mb => mb.ID === miv.messageitem.Message.MailboxID)?.Sent) {
				toAddrs = [...(miv.messageitem.Envelope.To || []), ...(miv.messageitem.Envelope.CC || []), ...(miv.messageitem.Envelope.BCC || [])]
			}
			return [fromAddrs, toAddrs]
		}

		// Correspondents for a message, possibly a collapsed thread root.
		const correspondents = () => {
			let fromAddrs: api.MessageAddress[] = []
			let toAddrs: api.MessageAddress[] = []
			let junk = m.Junk || !!listMailboxes().find(mb => mb.ID === m.MailboxID && (mb.Name === rejectsMailbox || mb.Junk))
			if (msgitemView.isCollapsedThreadRoot()) {
				// Gather both all correspondents in thread.
				;[msgitemView, ...(msgitemView.descendants())].forEach(miv => {
					const [fa, ta] = correspondentAddrs(miv)
					fromAddrs = [...fromAddrs, ...fa]
					toAddrs = [...toAddrs, ...ta]
					junk = junk || miv.messageitem.Message.Junk
				})
			} else {
				[fromAddrs, toAddrs] = correspondentAddrs(msgitemView)
			}

			const seen = new Set<string>()
			let fa: api.MessageAddress[] = []
			let ta: api.MessageAddress[] = []
			for (const a of fromAddrs) {
				const k = a.User+'@'+a.Domain.ASCII
				if (!seen.has(k)) {
					seen.add(k)
					fa.push(a)
				}
			}
			for (const a of toAddrs) {
				const k = a.User+'@'+a.Domain.ASCII
				if (!seen.has(k)) {
					seen.add(k)
					ta.push(a)
				}
			}
			let title = fa.map(a => formatAddress(a)).join(', ')
			if (ta.length > 0) {
				if (title) {
					title += ',\n'
				}
				title += ui('addressed: ')+ta.map(a => formatAddress(a)).join(', ')
			}
			return [
				attr.title(title),
				join(
					[
						...fa.map(a => new String(formatAddressShort(a, junk))),
						...ta.map(a => dom.span(style({fontStyle: 'italic'}), new String(formatAddressShort(a, junk)))),
					],
					() => ', '
				),
			]
		}

		ensureCSS('.msgItem.focus', {borderColor: styles.msgItemFocusBorderColor, borderLeftColor: styles.msgItemFocusBorderColor})
		ensureCSS('.msgItem:hover', {backgroundColor: styles.msgItemHoverBackgroundColor})
		ensureCSS('.msgItem.active', {background: styles.msgItemActiveBackground, borderLeftColor: styles.msgItemActiveBorder})

		// When rerendering, we remember active & focus states. So we don't have to make
		// the caller also call redraw on MsglistView.
		const active = msgitemView.root && msgitemView.root.classList.contains('active')
		const focus = msgitemView.root && msgitemView.root.classList.contains('focus')
		const elem = dom.div(
			dom._class('msgItem'),
			active ? dom._class('active') : [],
			focus ? dom._class('focus') : [],
			attr.draggable('true'),
			function dragstart(e: DragEvent) {
				if (!msglistView.selected().includes(msgitemView)) {
					e.preventDefault()
					window.alert(ui('Can only drag items in selection.'))
					return
				}
				// We send the Message.ID and MailboxID, so we can decide based on the destination
				// mailbox whether to move. We don't move messages already in the destination
				// mailbox, and also skip messages in the Sent mailbox when there are also messages
				// from other mailboxes.
				e.dataTransfer!.setData('application/vnd.mox.messages', JSON.stringify(msglistView.selected().map(miv => [miv.messageitem.Message.MailboxID, miv.messageitem.Message.ID])))
			},
			// Thread root with kids can be collapsed/expanded with double click.
			settings.threading !== api.ThreadMode.ThreadOff && !msgitemView.parent && msgitemView.kids.length > 0 ?
				function dblclick(e: MouseEvent) {
					e.stopPropagation() // Prevent selection.
					if (settings.threading === api.ThreadMode.ThreadOn) {
						// No await, we don't wait for the result.
						withStatus(ui("Saving thread expand/collapse"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], !msgitemView.collapsed))
					}
					if (msgitemView.collapsed) {
						msglistView.threadExpand(msgitemView)
					} else {
						msglistView.threadCollapse(msgitemView)
						msglistView.viewportEnsureMessages()
					}
				} : [],
			isUnread() ? dom._class('msgItemUnread') : [],
			// Relevant means not muted and matching the query.
			isRelevant() ? [] : css('msgItemNotRelevant', {opacity: '.4'}),
			dom.div(dom._class('msgItemCell'), dom._class('msgItemFlags'),
				dom.div(
					css('msgItemFlagsSpread', {display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px'}),
					dom.div(flagList(msgitemView)),
					!msgitemView.parent && msgitemView.kids.length > 0 && msgitemView.collapsed ?
						dom.clickbutton(dom._class('msgThreadToggle'), '' + (1+msgitemView.descendants().length), attr.tabindex('-1'), attr.title(ui("Expand thread.")), attr.arialabel(ui("Expand thread.")), function click(e: MouseEvent) {
							e.stopPropagation() // Prevent selection.
							if (settings.threading === api.ThreadMode.ThreadOn) {
								withStatus(ui("Saving thread expanded"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], false))
							}
							msglistView.threadExpand(msgitemView)
						}) : [],
					!msgitemView.parent && msgitemView.kids.length > 0 && !msgitemView.collapsed ?
						dom.clickbutton(dom._class('msgThreadToggle'), threadCollapseIcon(), attr.tabindex('-1'), attr.title(ui("Collapse thread.")), attr.arialabel(ui("Collapse thread.")), function click(e: MouseEvent) {
							e.stopPropagation() // Prevent selection.
							if (settings.threading === api.ThreadMode.ThreadOn) {
								withStatus(ui("Saving thread expanded"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], true))
							}
							msglistView.threadCollapse(msgitemView)
							msglistView.viewportEnsureMessages()
						}) : [],
				),
			),
			dom.div(dom._class('msgItemCell'), dom._class('msgItemMain'),
				dom.div(dom._class('msgItemFromRow'),
					dom.clickbutton(
						dom._class('msgItemFlagBtn'),
						mi.Message.Flagged ? dom._class('isOn') : [],
						flagMarkIcon(mi.Message.Flagged),
						attr.arialabel(mi.Message.Flagged ? ui('Remove flag') : ui('Flag message')),
						attr.title(mi.Message.Flagged ? ui('Remove flag.') : ui('Flag message.')),
						async function click(e: MouseEvent) {
							e.preventDefault()
							e.stopPropagation()
							const id = mi.Message.ID
							if (mi.Message.Flagged) {
								await withStatus(ui("Removing flag"), client.FlagsClear([id], ['\\Flagged']))
							} else {
								await withStatus(ui('Flagging'), client.FlagsAdd([id], ['\\Flagged']))
							}
						},
					),
					dom.div(
						dom._class('silenttitle'),
						dom._class('msgItemFromText'),
						correspondents(),
					),
					identityHeader,
				),
				dom.div(dom._class('msgItemSubjectRow'),
					dom.div(
						dom._class('msgItemSubjectText'),
						threadIndent > 0 ? dom.span(threadChar, style({paddingLeft: (threadIndent/2)+'em'}), css('msgItemThreadChar', {opacity: '.75', fontWeight: 'normal'}), threadCharTitle ? attr.title(threadCharTitle) : []) : [],
						msgitemView.parent ? [] : new String(mi.Envelope.Subject || ui('(no subject)')),
					),
					dom.div(
						keywords,
						mailboxtags,
					),
				),
				mi.Message.Preview ? dom.div(dom._class('msgItemPreviewRow'),
					dom.div(dom._class('msgItemPreviewText'), new String(mi.Message.Preview)),
				) : [],
				// Thread messages are connected by a vertical bar. The first and last message are
				// only half the height of the item, to indicate start/end, and so it stands out
				// from any thread above/below.
				((msgitemView.parent || msgitemView.kids.length > 0) && !msgitemView.threadRoot().collapsed) ?
					dom.div(css('msgItemThreadBar', {position: 'absolute', right: 0, top: 0, bottom: 0, borderRight: '2px solid', borderRightColor: styles.colorMilder}),
						!msgitemView.parent ? css('msgItemThreadBarFirst', {top: '50%', bottom: '-1px'}) : (
							isThreadLast() ?
								css('msgItemThreadBarLast', {top: '-1px', bottom: '50%'}) :
								css('msgItemThreadBarMiddle', {top: '-1px', bottom: '-1px'})
						)
					) : []
			),
			dom.div(dom._class('msgItemCell'), dom._class('msgItemAge'), age(received())),
			dom.div(dom._class('msgItemHoverActions'),
					mi.Message.MailboxID === msglistView.mailboxes().find(box => box.Trash)?.ID ?
						dom.clickbutton(dom._class('msgItemHoverIcon'), dom._class('msgItemHoverDanger'), strokeIcon(strokePaths.trash), attr.arialabel(ui("Delete")), attr.title(ui("Permanently delete message.")), async function click(e: MouseEvent) {
							e.preventDefault()
							e.stopPropagation()
							if (msglistView.selected().includes(msgitemView)) {
								await msglistView.cmdDelete()
								return
							}
							if (!window.confirm(ui("Are you sure you want to permanently delete?"))) {
								return
							}
							forgetMovedMessages([mi.Message.ID])
							await withStatus(ui("Permanently deleting messages"), client.MessageDelete([mi.Message.ID]))
						}) :
						dom.clickbutton(dom._class('msgItemHoverIcon'), strokeIcon(strokePaths.trash), attr.arialabel(ui("Trash")), attr.title(ui("Move to the Trash mailbox.")), async function click(e: MouseEvent) {
							e.preventDefault()
							e.stopPropagation()
							if (msglistView.selected().includes(msgitemView)) {
								await msglistView.cmdTrash()
								return
							}
							const mb = msglistView.mailboxes().find(box => box.Trash)
							if (!mb) {
								window.alert(ui("No mailbox configured for trash yet."))
								return
							}
							if (mi.Message.MailboxID === mb.ID) {
								return
							}
							await withStatus(ui("Moving to trash mailbox"), client.MessageMove([mi.Message.ID], mb.ID, true))
							offerMoveUndo([{id: mi.Message.ID, mailboxID: mi.Message.MailboxID}])
						}),
					dom.clickbutton(dom._class('msgItemHoverIcon'), strokeIcon(strokePaths.archive), attr.arialabel(ui("Archive")), attr.title(ui("Move to the Archive mailbox.")), async function click(e: MouseEvent) {
						e.preventDefault()
						e.stopPropagation()
						if (msglistView.selected().includes(msgitemView)) {
							await msglistView.cmdArchive()
							return
						}
						const mb = msglistView.mailboxes().find(box => box.Archive)
						if (!mb) {
							window.alert(ui("No mailbox configured for archiving yet."))
							return
						}
						if (mi.Message.MailboxID === mb.ID) {
							return
						}
						await withStatus(ui("Moving to archive mailbox"), client.MessageMove([mi.Message.ID], mb.ID, true))
						offerMoveUndo([{id: mi.Message.ID, mailboxID: mi.Message.MailboxID}])
					}),
				),
			function click(e: MouseEvent) {
				e.preventDefault()
				e.stopPropagation()
				msglistView.click(msgitemView, e.ctrlKey, e.shiftKey)
			}
		)
		msgitemView.root.replaceWith(elem)
		msgitemView.root = elem
	}

	const msgitemView: MsgitemView = {
		root: dom.div(),
		messageitem: mi,
		receivedTime: receivedTime,
		kids: [],
		parent: null,
		collapsed: initialCollapsed,

		threadRoot: () => {
			let miv = msgitemView
			while (miv.parent) {
				miv = miv.parent
			}
			return miv
		},

		isCollapsedThreadRoot: () => !msgitemView.parent && msgitemView.collapsed && msgitemView.kids.length > 0,

		descendants: () => {
			let l: MsgitemView[] = []
			const walk = (miv: MsgitemView) => {
				for (const kmiv of miv.kids) {
					l.push(kmiv)
					walk(kmiv)
				}
			}
			walk(msgitemView)
			return l
		},

		// We often just need to know if a descendant with certain properties exist. No
		// need to create an array, then call find on it.
		findDescendant: (matchfn) => {
			const walk = (miv: MsgitemView): MsgitemView | null => {
				if (matchfn(miv)) {
					return miv
				}
				for (const kmiv of miv.kids) {
					const r = walk(kmiv)
					if (r) {
						return r
					}
				}
				return null
			}
			return walk(msgitemView)
		},

		lastDescendant: () => {
			let l = msgitemView
			if (l.kids.length === 0) {
				return null
			}
			while(l.kids.length > 0) {
				l = l.kids[l.kids.length-1]
			}
			return l
		},

		remove: remove,
		render: render,
	}

	return msgitemView
}

interface MsgView {
	root: HTMLElement
	messageitem: api.MessageItem
	// Called when keywords for a message have changed, to rerender them.
	updateKeywords: (modseq: number, keywords: string[]) => Promise<void>
	// Abort loading the message.
	aborter: { abort: () => void }
	key: (key: string, e: KeyboardEvent) => Promise<void>
}

// If attachmentView is open, keyboard shortcuts go there.
let attachmentView: {key: (k: string, e: KeyboardEvent) => Promise<void>} | null = null

// MsgView is the display of a single message.
// refineKeyword is called when a user clicks a label, to filter on those.
const newMsgView = (miv: MsgitemView, msglistView: MsglistView, listMailboxes: listMailboxes, setLocationHash: setLocationHash, possibleLabels: possibleLabels, messageLoaded: () => void, refineKeyword: (kw: string) => Promise<void>, parsedMessageOpt?: api.ParsedMessage): MsgView => {
	const mi = miv.messageitem
	const m = mi.Message

	const fromAddress = mi.Envelope.From && mi.Envelope.From.length === 1 ? formatEmail(mi.Envelope.From[0]) : ''

	// Some operations below, including those that can be reached through shortcuts,
	// need a parsed message. So we keep a promise around for having that parsed
	// message. Operations always await it. Once we have the parsed message, the await
	// completes immediately.
	// Typescript doesn't know the function passed to new Promise runs immediately and
	// has set the Resolve and Reject variables before returning. Is there a better
	// solution?
	let parsedMessageResolve: (pm: api.ParsedMessage) => void = () => {}
	let parsedMessageReject: (err: Error) => void = () => {}
	let parsedMessagePromise = new Promise<api.ParsedMessage>((resolve, reject) => {
		parsedMessageResolve = resolve
		parsedMessageReject = reject
	})

	const react = async (to: api.MessageAddress[], cc: api.MessageAddress[], bcc: api.MessageAddress[], forward: boolean) => {
		const pm = await parsedMessagePromise
		let body = ''
		const sel = window.getSelection()
		let haveSel = false
		if (sel && sel.toString()) {
			body = sel.toString()
			haveSel = true
		} else if (pm.Texts && pm.Texts.length > 0) {
			body = pm.Texts[0]
		}
		body = body.replace(/\r/g, '').replace(/\n\n\n\n*/g, '\n\n').trim()
		let editOffset = 0
		if (forward) {
			const env = mi.Envelope
			const subject = env.Subject ? [env.Subject] : []
			const date = pm.Headers?.Date || []
			const from = (env.From || []).map(a => formatAddress(a))
			const replyTo = (env.ReplyTo || []).map(a => formatAddress(a))
			const to = (env.To || []).map(a => formatAddress(a))
			const cc = (env.CC || []).map(a => formatAddress(a))

			let prefix = `\n\n---- Forwarded Message ----\n`

			const fields: [string, string[]][] = [
				[ui("Subject:"), subject],
				[ui("Date:"), date],
				[ui("From:"), from],
				[ui("Reply-To:"), replyTo],
				[ui("To:"), to],
				[ui("Cc:"), cc],
			]
			const labelWidth = fields.reduce((n, [k, l]) => l.length === 0 ? n : Math.max(n, k.length), 0)
			const padspace = (s: string, size: number) => s + ' '.repeat(Math.max(0, size-s.length))
			const add = (k: string, l: string[]) => {
				if (l.length === 0) {
					return
				}
				const last = l.length-1
				l.map((v: string, i: number) => {
					prefix += padspace(k, labelWidth) + ' ' + v
					if (i < last) {
						prefix += ','
					}
					prefix += '\n'
					k = ''
				})
			}
			for (const [k, l] of fields) {
				add(k, l)
			}

			body = prefix+'\n'+body
		} else {
			body = body.split('\n').map(line => '> ' + line).join('\n')
			let sig = accountSettings?.Signature || ''
			if (!accountSettings?.Quoting && haveSel || accountSettings?.Quoting === api.Quoting.Bottom) {
				body += '\n\n'
				editOffset = body.length
				body += '\n\n' + sig
			} else {
				let onWroteLine = ''
				if (mi.Envelope.Date && mi.Envelope.From && mi.Envelope.From.length === 1) {
					const from = mi.Envelope.From[0]
					const name = from.Name || formatEmail(from)
					// If message did not have Date header, we'll get the Go zero value, with year 1. Use time received instead in that case.
					const dt = mi.Envelope.Date.getFullYear() === 1 ?  m.Received : mi.Envelope.Date
					const datetime = dt.toLocaleString(uiLocale(), {weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit"})
					onWroteLine = wroteLine(datetime, name)
				}
				body = '\n\n' + sig + '\n' + onWroteLine + body
			}
		}
		const subjectPrefix = forward ? 'Fwd:' : 'Re:'
		let subject = mi.Envelope.Subject || ''
		subject = (RegExp('^'+subjectPrefix, 'i').test(subject) ? '' : subjectPrefix+' ') + subject
		const opts: ComposeOptions = {
			from: mi.Envelope.To || undefined,
			to: to.map(a => formatAddress(a)),
			cc: cc.map(a => formatAddress(a)),
			bcc: bcc.map(a => formatAddress(a)),
			subject: subject,
			body: body,
			isForward: forward,
			attachmentsMessageItem: forward ? mi : undefined,
			responseMessageID: m.ID,
			isList: m.IsMailingList,
			editOffset: editOffset,
			// For "send and archive", we only move messages from the current open mailbox
			// (fallback to mailbox of response message for search results) to the archive
			// mailbox. We don't want to move messages in other mailboxes, like Sent, Trash, or
			// for cross-posted messages in other mailboxes.
			archiveReferenceMailboxID: msglistView.activeMailbox()?.ID || m.MailboxID,
		}
		compose(opts, listMailboxes, setLocationHash)
	}

	const reply = async (all: boolean) => {
		const contains = (l: api.MessageAddress[], a: api.MessageAddress): boolean => !!l.find(e => equalAddress(e, a))

		let to: api.MessageAddress[] = []
		let cc: api.MessageAddress[] = []
		let bcc: api.MessageAddress[] = []
		if ((mi.Envelope.From || []).length === 1 && envelopeIdentity(mi.Envelope.From || [])) {
			// Replying to our own message, copy the original cc/bcc.
			to = mi.Envelope.To || []
		} else {
			if (mi.Envelope.ReplyTo && mi.Envelope.ReplyTo.length > 0) {
				to = mi.Envelope.ReplyTo
			} else {
				to = mi.Envelope.From || []
			}
			if (all) {
				for (const a of (mi.Envelope.To || [])) {
					if (!contains(to, a) && !envelopeIdentity([a])) {
						to.push(a)
					}
				}
			}
		}
		if (all) {
			cc = mi.Envelope.CC || []
			bcc = mi.Envelope.BCC || []
		}
		cc = cc.filter((a, i) => !envelopeIdentity([a]) && !contains(to, a) && !contains(cc.slice(0, i), a))
		bcc = bcc.filter(a => !envelopeIdentity([a]))
		await react(to, cc, bcc, false)
	}
	const cmdForward = async () => { react([], [], [], true) }
	const cmdReplyList = async () => {
		const pm = await parsedMessagePromise
		if (pm.ListReplyAddress) {
			await react([pm.ListReplyAddress], [], [], false)
		}
	}
	const cmdReply = async () => { await reply(false) }
	const cmdReplyAll = async () => { await reply(true) }
	const cmdPrint = async () => {
		if (urlType) {
			window.open('msg/'+m.ID+'/msg'+urlType+'#print', '_blank')
		}
	}
	const cmdOpenNewTab = async () => {
		if (urlType) {
			window.open('msg/'+m.ID+'/msg'+urlType, '_blank')
		}
	}
	const cmdOpenRaw = async () => { window.open('msg/'+m.ID+'/raw', '_blank') }
	const cmdOpenRawPart = async () => {
		const pm = await parsedMessagePromise
		let path: number[] | null = null
		if (urlType === 'text' && pm.TextPaths && pm.TextPaths.length > 0) {
			path = pm.TextPaths[0]
		} else if ((urlType === 'html' || urlType === 'htmlexternal') && pm.HTMLPath) {
			path = pm.HTMLPath
		}
		if (!path) {
			window.alert(ui("Part not found."))
			return
		}
		window.open('msg/'+m.ID+'/viewtext/'+[0, ...path].join('.'), '_blank')
	}
	const cmdDownloadRaw = async () => { window.open('msg/'+m.ID+'/rawdl', '_blank') }
	const cmdViewAttachments = async () => {
		if (attachments.length > 0) {
			view(attachments[0])
		}
	}
	const cmdComposeDraft = async () => {
		const pm = await parsedMessagePromise
		composeDraft(mi, pm, listMailboxes, setLocationHash)
	}

	const cmdToggleHeaders = async () => {
		settingsPut({...settings, showAllHeaders: !settings.showAllHeaders})
		const pm = await parsedMessagePromise
		if (isMobile() && settings.showAllHeaders) {
			msgheaderDetailsExpanded = true
			msgheaderDetailsElem.classList.add('expanded')
		}
		loadHeaderDetails(pm)
		loadMobileHeaderSummary()
	}

	let textbtn: HTMLButtonElement, htmlbtn: HTMLButtonElement, htmlextbtn: HTMLButtonElement
	const activeBtn = (b: HTMLButtonElement) => {
		for (const xb of [textbtn, htmlbtn, htmlextbtn]) {
			if (xb) {
				xb.classList.toggle('active', xb === b)
			}
		}
	}

	const fromAddressSettingsSave = async (mode: api.ViewMode) => {
		const froms = mi.Envelope.From || []
		if (froms.length === 1) {
			await withStatus(ui("Saving view mode settings for address"), client.FromAddressSettingsSave({FromAddress: froms[0].User + "@" + (froms[0].Domain.Unicode || froms[0].Domain.ASCII), ViewMode: mode}))
		}
	}

	const cmdShowText = async () => {
		if (!textbtn) {
			return
		}
		loadText(await parsedMessagePromise)
		activeBtn(textbtn)
		await fromAddressSettingsSave(api.ViewMode.ModeText)
	}
	const cmdShowHTML = async () => {
		if (!htmlbtn || !htmlextbtn) {
			return
		}
		loadHTML()
		activeBtn(htmlbtn)
		await fromAddressSettingsSave(api.ViewMode.ModeHTML)
	}
	const cmdShowHTMLExternal = async () => {
		if (!htmlbtn || !htmlextbtn) {
			return
		}
		loadHTMLexternal()
		activeBtn(htmlextbtn)
		await fromAddressSettingsSave(api.ViewMode.ModeHTMLExt)
	}
	const cmdShowHTMLCycle = async () => {
		if (urlType === 'html') {
			await cmdShowHTMLExternal()
		} else {
			await cmdShowHTML()
		}
	}
	const cmdShowInternals = async () => {
		const pm = await parsedMessagePromise
		const mimepart = (p: api.Part): HTMLElement => dom.li(
			(p.MediaType + '/' + p.MediaSubType).toLowerCase(),
			p.ContentTypeParams ? ' '+JSON.stringify(p.ContentTypeParams) : [],
			p.Parts && p.Parts.length === 0 ? [] : dom.ul(
				dom._class('internalsList'),
				(p.Parts || []).map(pp => mimepart(pp))
			)
		)
		const remove = popup(
			dom.div(
				dom._class('dialogPanel'),
				dom._class('internalsPanel'),
				dom.div(dom._class('dialogHeader'),
					dom.h1(ui("MIME internals")),
					dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close internals.")), function click() {
						remove()
					}),
				),
				dom.div(dom._class('dialogBody'),
					dom.div(dom._class('internalsColumns'),
						dom.div(
							dom.h2(ui("Mime structure")),
							dom.ul(dom._class('internalsList'), mimepart(pm.Part)),
						),
						dom.div(
							dom.h2(ui("Message")),
							dom.pre(dom._class('internalsPre'), JSON.stringify(m, undefined, '\t')),
						),
						dom.div(
							dom.h2(ui('Part')),
							dom.pre(dom._class('internalsPre'), JSON.stringify(pm.Part, undefined, '\t')),
						),
					),
				),
				dom.div(dom._class('dialogFooter'),
					dom.clickbutton(ui("Close"), function click() {
						remove()
					}),
				),
			),
		)
	}

	const cmdUp = async () => { msgscrollElem.scrollTo({top: msgscrollElem.scrollTop - 3*msgscrollElem.getBoundingClientRect().height / 4, behavior: 'smooth'}) }
	const cmdDown = async () => { msgscrollElem.scrollTo({top: msgscrollElem.scrollTop + 3*msgscrollElem.getBoundingClientRect().height / 4, behavior: 'smooth'}) }
	const cmdHome = async () => { msgscrollElem.scrollTo({top: 0 }) }
	const cmdEnd = async () => { msgscrollElem.scrollTo({top: msgscrollElem.scrollHeight}) }

	const shortcuts: {[key: string]: command} = {
		e: cmdComposeDraft,
		I: cmdShowInternals,
		o: cmdOpenNewTab,
		O: cmdOpenRaw,
		'ctrl p': cmdPrint,
		f: cmdForward,
		r: cmdReply,
		R: cmdReplyAll,
		v: cmdViewAttachments,
		t: cmdShowText,
		T: cmdShowHTMLCycle,
		'ctrl i': cmdToggleHeaders,

		'alt j': cmdDown,
		'alt k': cmdUp,
		'alt ArrowDown': cmdDown,
		'alt ArrowUp': cmdUp,
		'alt J': cmdEnd,
		'alt K': cmdHome,

		// For showing shortcuts only, handled in msglistView.
		a: msglistView.cmdArchive,
		d: msglistView.cmdTrash,
		D: msglistView.cmdDelete,
		q: msglistView.cmdJunk,
		Q: msglistView.cmdMarkNotJunk,
		m: msglistView.cmdMarkRead,
		M: msglistView.cmdMarkUnread,
	}

	let urlType: string // text, html, htmlexternal; for opening in new tab/print

	let msgbuttonElem: HTMLElement, msgheaderElem: HTMLTableSectionElement, msgattachmentElem: HTMLElement, msgmodeElem: HTMLElement
	let msgheaderFullElem: HTMLTableElement // Full headers, when enabled.
	let msgmobileSummaryElem: HTMLElement
	let msgheaderDetailsElem: HTMLElement
	let msgheaderDetailsExpanded = false

	const msgmetaElem = dom.div(
		css('msgmeta', {backgroundColor: styles.backgroundColorMild, borderBottom: '5px solid', borderBottomColor: ['white', 'black'], maxHeight: '90%', overflowY: 'auto'}),
		attr.role('region'), attr.arialabel(ui("Buttons and headers for message")),
		msgmobileSummaryElem=dom.div(dom._class('msgMobileSummary')),
		msgbuttonElem=dom.div(),
		dom.div(
			attr.arialive('assertive'),
			msgheaderDetailsElem=dom.div(dom._class('msgHeaderDetails'),
				dom.table(
					styleClasses.msgHeaders,
					msgheaderElem=dom.tbody(),
				),
				msgheaderFullElem=dom.table(css('msgHeaderExtra', {width: '100%'})),
			),
			msgattachmentElem=dom.div(),
			msgmodeElem=dom.div(),
		),
		// Explicit separator that separates headers from body, to
		// prevent HTML messages from faking UI elements.
		dom.div(css('headerBodySeparator', {height: '2px', backgroundColor: styles.borderColor})),
	)

	const msgscrollElem = dom.div(dom._class('pad'), yscrollAutoStyle,
		attr.role('region'), attr.arialabel(ui("Message body")),
		css('msgscroll', {backgroundColor: styles.backgroundColor}),
	)
	const msgcontentElem = dom.div(
		css('scrollparent', {position: 'relative', flexGrow: '1'}),
	)

	const trashMailboxID = listMailboxes().find(mb => mb.Trash)?.ID
	const draftMailboxID = listMailboxes().find(mb => mb.Draft)?.ID
	let buttonPm: api.ParsedMessage | null = parsedMessageOpt || null

	const trashOrDeleteBtn = () => m.MailboxID === trashMailboxID ?
		dom.clickbutton(ui("Delete"), attr.title(ui("Permanently delete message.")), clickCmd(msglistView.cmdDelete, shortcuts)) :
		dom.clickbutton(ui("Trash"), attr.title(ui("Move to the Trash mailbox.")), clickCmd(msglistView.cmdTrash, shortcuts))

	const moreActionsPopover = (ref: HTMLElement) => {
		menuPopover(ref, [
			(!buttonPm || !buttonPm.ListReplyAddress) ? [] : dom.clickbutton(ui("Reply to list"), attr.title(ui("Compose a reply to this mailing list.")), clickCmd(cmdReplyList, shortcuts)),
			dom.clickbutton(ui("Junk"), attr.title(ui("Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages.")), clickCmd(msglistView.cmdJunk, shortcuts)),
			dom.clickbutton(ui("Move to..."), function click(e: MouseEvent) {
				movePopover(e, listMailboxes(), [m])
			}),
			dom.clickbutton(ui("Labels..."), function click(e: MouseEvent) {
				labelsPopover(e, [m], possibleLabels)
			}),
			dom.clickbutton(ui("Print"), attr.title(ui("Print message, opens in new tab and opens print dialog.")), clickCmd(cmdPrint, shortcuts)),
			dom.clickbutton(ui("Mark Not Junk"), attr.title(ui("Mark as not junk, causing this message to be used in spam classification of new incoming messages.")), clickCmd(msglistView.cmdMarkNotJunk, shortcuts)),
			dom.clickbutton(ui("Mark Read"), clickCmd(msglistView.cmdMarkRead, shortcuts)),
			dom.clickbutton(ui("Mark Unread"), clickCmd(msglistView.cmdMarkUnread, shortcuts)),
			dom.clickbutton(ui("Mute thread"), clickCmd(msglistView.cmdMute, shortcuts)),
			dom.clickbutton(ui("Unmute thread"), clickCmd(msglistView.cmdUnmute, shortcuts)),
			dom.clickbutton(ui("Open in new tab"), clickCmd(cmdOpenNewTab, shortcuts)),
			dom.clickbutton(ui("Download raw original message"), clickCmd(cmdDownloadRaw, shortcuts)),
			dom.clickbutton(ui("Export as ..."), function click(e: {target: HTMLElement}) {
				popoverExport(e.target, '', [m.ID])
			}),
			dom.clickbutton(ui("Show raw original message in new tab"), clickCmd(cmdOpenRaw, shortcuts)),
			dom.clickbutton(ui("Show currently displayed part as decoded text"), clickCmd(cmdOpenRawPart, shortcuts)),
			dom.clickbutton(ui("Show internals in popup"), clickCmd(cmdShowInternals, shortcuts)),
		])
	}

	// Initially called with potentially null pm, once loaded called again with pm set.
	const loadButtons = (pm: api.ParsedMessage | null) => {
		buttonPm = pm
		const oneRecipient = (mi.Envelope.To || []).length <= 1 && (mi.Envelope.CC || []).length === 0 && (mi.Envelope.BCC || []).length === 0
		const row = dom.div(dom._class('msgActionRow'),
			m.MailboxID === draftMailboxID ? dom.clickbutton(ui("Edit"), attr.title(ui("Continue editing this draft message.")), clickCmd(cmdComposeDraft, shortcuts)) : [],
			(pm && pm.ListReplyAddress && formatEmail(pm.ListReplyAddress) === fromAddress) ? [] : dom.clickbutton(ui("Reply"), attr.title(ui("Compose a reply to the sender of this message.")), clickCmd(cmdReply, shortcuts)),
			oneRecipient ? [] : dom.clickbutton(ui("Reply all"), attr.title(ui("Compose a reply to all participants of this message.")), clickCmd(cmdReplyAll, shortcuts)),
			dom.clickbutton(ui("Forward"), attr.title(ui("Compose a forwarding message, optionally including attachments.")), clickCmd(cmdForward, shortcuts)),
			trashOrDeleteBtn(),
			dom.clickbutton(ui("Archive"), attr.title(ui("Move to the Archive mailbox.")), clickCmd(msglistView.cmdArchive, shortcuts)),
			dom.clickbutton(ui("More"), attr.title(ui("More actions.")), function click(e: MouseEvent) {
				moreActionsPopover(e.target! as HTMLElement)
			}),
		)
		dom._kids(msgbuttonElem,
			isMobile() ? dom.div(dom._class('msgbuttonMobile'), row) : dom.div(dom._class('msgbuttonScroll'), row),
		)
	}
	loadButtons(parsedMessageOpt || null)

	const recipientLabel = (a: api.MessageAddress): string => {
		const n = a.Name
		if (n && !n.includes('<') && !n.includes('@') && !n.includes('>')) {
			return n
		}
		return formatEmail(a)
	}

	const recipientsShort = (addrs: api.MessageAddress[]) => {
		if (addrs.length === 0) {
			return ui('undisclosed recipients')
		}
		const names = addrs.map(recipientLabel)
		if (names.length <= 2) {
			return names.join(', ')
		}
		return names[0] + ', ' + names[1] + ' +' + (names.length - 2)
	}

	const loadMobileHeaderSummary = () => {
		if (!isMobile()) {
			dom._kids(msgmobileSummaryElem, [])
			return
		}
		const msgenv = mi.Envelope
		const received = mi.Message.Received
		const receivedlocal = new Date(received.getTime())
		const dateStr = receivedlocal.toLocaleDateString(uiLocale(), {month: 'short', day: 'numeric'}) + ' ' + receivedlocal.toLocaleTimeString(uiLocale(), {hour: '2-digit', minute: '2-digit'})
		const from = (msgenv.From || [])[0]
		const fromStr = from ? formatAddressShort(from, false) : ui('(unknown sender)')
		let toLine = ui('To: ') + recipientsShort(msgenv.To || [])
		const cc = msgenv.CC || []
		if (cc.length > 0) {
			toLine += ui(' · Cc: ') + recipientsShort(cc)
		}
		const chips: HTMLElement[] = []
		if (mi.Message.IsForward) {
			chips.push(dom.span(dom._class('msgMobileSummaryChip'), ui("Forwarded")))
		}
		if (mi.Message.IsMailingList) {
			chips.push(dom.span(dom._class('msgMobileSummaryChip'), ui("Mailing list")))
		}
		if (mi.IsSigned) {
			chips.push(dom.span(dom._class('msgMobileSummaryChip'), ui('Signed')))
		}
		if (mi.IsEncrypted) {
			chips.push(dom.span(dom._class('msgMobileSummaryChip'), ui('Encrypted')))
		}
		if (refineKeyword) {
			for (const kw of mi.Message.Keywords || []) {
				chips.push(dom.clickbutton(
					dom._class('msgMobileSummaryChip'),
					kw,
					async function click() {
						await refineKeyword(kw)
					},
				))
			}
		}
		dom._kids(msgmobileSummaryElem,
			dom.div(dom._class('msgMobileSummaryTop'),
				dom.div(dom._class('msgMobileSummaryFrom'), fromStr),
				dom.div(
					dom._class('msgMobileSummaryDate'),
					attr.title(ui("Received: ") + received.toString() + ';\n' + ui('Date header in message: ') + (msgenv.Date ? msgenv.Date.toString() : ui('(missing/invalid)'))),
					dateStr,
				),
			),
			dom.div(dom._class('msgMobileSummaryMeta'),
				dom.span(dom._class('msgMobileSummaryTo'), toLine),
				dom.clickbutton(
					dom._class('msgMobileDetailsToggle'),
					msgheaderDetailsExpanded ? ui('Less') : ui('Details'),
					attr.title(msgheaderDetailsExpanded ? ui('Hide full headers.') : ui('Show full headers.')),
					function click() {
						msgheaderDetailsExpanded = !msgheaderDetailsExpanded
						msgheaderDetailsElem.classList.toggle('expanded', msgheaderDetailsExpanded)
						loadMobileHeaderSummary()
					},
				),
			),
			chips.length > 0 ? dom.div(dom._class('msgMobileSummaryChips'), chips) : [],
		)
	}

	loadMsgheaderView(msgheaderElem, miv.messageitem, accountSettings.ShowHeaders || [], refineKeyword, false)
	loadMobileHeaderSummary()

	// Similar to lib.ts:/msgHeaderFieldStyle
	const headerTextMildStyle = css('headerTextMild', {textAlign: 'right', color: styles.colorMild})
	const loadHeaderDetails = (pm: api.ParsedMessage) => {
		const table = dom.table(
			css('msgHeaderExtra', {width: '100%'}),
			!settings.showAllHeaders ? [] :
				Object.entries(pm.Headers || {}).sort().map(t =>
					(t[1] || []).map(v =>
						dom.tr(
							dom.td(t[0]+':', headerTextMildStyle),
							dom.td(v),
						)
					)
				)
		)
		msgheaderFullElem.replaceWith(table)
		msgheaderFullElem = table
	}

	const isText = (a: api.Attachment) => ['text', 'message'].includes(a.Part.MediaType.toLowerCase())
	const isPDF = (a: api.Attachment) => (a.Part.MediaType+'/'+a.Part.MediaSubType).toLowerCase() === 'application/pdf'
	const isViewable = (a: api.Attachment) => isText(a) || isImage(a) || isPDF(a)
	const attachments: api.Attachment[] = (mi.Attachments || [])

	let beforeViewFocus: Element | null
	const view = (a: api.Attachment) => {
		if (!beforeViewFocus) {
			beforeViewFocus = document.activeElement
		}

		const pathStr = [0].concat(a.Path || []).join('.')
		const index = attachments.indexOf(a)

		const cmdViewPrev = async () => {
			if (index > 0) {
				popupRoot.remove()
				view(attachments[index-1])
			}
		}
		const cmdViewNext = async () => {
			if (index < attachments.length-1) {
				popupRoot.remove()
				view(attachments[index+1])
			}
		}
		const cmdViewFirst = async () => {
			popupRoot.remove()
			view(attachments[0])
		}
		const cmdViewLast = async () => {
			popupRoot.remove()
			view(attachments[attachments.length-1])
		}
		const cmdViewClose = async () => {
			popupRoot.remove()
			if (beforeViewFocus && beforeViewFocus instanceof HTMLElement && beforeViewFocus.parentNode) {
				beforeViewFocus.focus()
			}
			attachmentView = null
			beforeViewFocus = null
		}

		const attachShortcuts = {
			h: cmdViewPrev,
			ArrowLeft: cmdViewPrev,
			l: cmdViewNext,
			ArrowRight: cmdViewNext,
			'0': cmdViewFirst,
			'$': cmdViewLast,
			Escape: cmdViewClose,
		}

		const attachmentsArrowStyle = css('attachmentsArrow', {color: styles.backgroundColor, backgroundColor: styles.color, width: '2em', height: '2em', borderRadius: '1em', lineHeight: '2em', textAlign: 'center', fontWeight: 'bold'})
		const attachmentsIframeStyle = css('attachmentsIframe', {flexGrow: 1, boxShadow: styles.boxShadow, margin: '0 5em'})

		let content: HTMLElement
		const popupRoot = dom.div(
			css('attachmentsOverlay', {position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: styles.overlayBackgroundColor, display: 'flex', flexDirection: 'column', alignContent: 'stretch', padding: '1em', zIndex: zindexes.attachments}),
			function click(e: MouseEvent) {
				e.stopPropagation()
				cmdViewClose()
			},
			attr.tabindex('0'),
			!(index > 0) ? [] : dom.div(
				css('attachmentsPrevious', {position: 'absolute', left: '1em', top: 0, bottom: 0, fontSize: '1.5em', width: '2em', display: 'flex', alignItems: 'center', cursor: 'pointer'}),
				dom.div(dom._class('silenttitle'),
					attachmentsArrowStyle,
					attr.title(ui("To previous viewable attachment.")),
					'←',
				),
				attr.tabindex('0'),
				clickCmd(cmdViewPrev, attachShortcuts),
				enterCmd(cmdViewPrev, attachShortcuts),
			),
			dom.div(
				css('attachmentsDownloadHeaderBox', {textAlign: 'center', paddingBottom: '30px'}),
				dom.span(dom._class('pad'),
					function click(e: MouseEvent) {
						e.stopPropagation()
					},
					css('attachmentsDownloadHeader', {display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: styles.popupBackgroundColor, color: styles.popupColor, boxShadow: styles.boxShadow, border: '1px solid', borderColor: styles.popupBorderColor, borderRadius: styles.radius}),
					dom.span(a.Filename || ui('(unnamed)')),
					dom.span('·', style({color: styles.colorMilder})),
					dom.span(formatSize(a.Part.DecodedSize)),
					dom.a(dom._class('button'), ui('Download'), attr.download(''), attr.href('msg/'+m.ID+'/download/'+pathStr), function click(e: MouseEvent) { e.stopPropagation() }),
				),
			),
			isImage(a) ?
				dom.div(
					css('attachmentsImageBox', {flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 'calc(100% - 50px)', margin: '0 5em'}),
					dom.img(
						css('attachmentsImage', {maxWidth: '100%', maxHeight: '100%', boxShadow: styles.boxShadow , margin: '0 30px'}),
						attr.src('msg/'+m.ID+'/view/'+pathStr)
					),
				) : (
					isText(a) ?
						dom.iframe(
							attr.title(ui("Attachment shown as text.")),
							attachmentsIframeStyle,
							attr.src('msg/'+m.ID+'/viewtext/'+pathStr)
						) : (
							isPDF(a) ?
								dom.iframe(
									attr.title(ui("Attachment as PDF.")),
									attachmentsIframeStyle,
									attr.src('msg/'+m.ID+'/view/'+pathStr)
								) :
								content=dom.div(
									function click(e: MouseEvent) {
										e.stopPropagation()
									},
									css('attachmentsBinary', {minWidth: '30em', padding: '2ex', boxShadow: styles.boxShadow, backgroundColor: styles.popupBackgroundColor, margin: '0 5em', textAlign: 'center'}),
									dom.div(style({marginBottom: '2ex'}), ui("Attachment could be a binary file.")),
									dom.clickbutton(ui("View as text"), function click() {
										content.replaceWith(
											dom.iframe(
												attr.title(ui("Attachment shown as text, though it could be a binary file.")),
												attachmentsIframeStyle,
												attr.src('msg/'+m.ID+'/viewtext/'+pathStr)
											)
										)
									}),
						)
					)
				),
			!(index < attachments.length-1) ? [] : dom.div(
				css('attachmentsNext', {position: 'absolute', right: '1em', top: 0, bottom: 0, fontSize: '1.5em', width: '2em', display: 'flex', alignItems: 'center', cursor: 'pointer'}),
				dom.div(dom._class('silenttitle'),
					attachmentsArrowStyle,
					attr.title(ui("To next viewable attachment.")),
					'→',
				),
				attr.tabindex('0'),
				clickCmd(cmdViewNext, attachShortcuts),
				enterCmd(cmdViewNext, attachShortcuts),
			),
		)
		document.body.appendChild(popupRoot)
		popupRoot.focus()
		attachmentView = {key: keyHandler(attachShortcuts)}
	}

	var filesAll = false
	const renderAttachments = () => {
		const l = mi.Attachments || []
		dom._kids(msgattachmentElem,
			(l && l.length === 0) ? [] : dom.div(
				css('inlineAttachmentsSeparator', {borderTop: '1px solid', borderTopColor: styles.borderColor}),
				dom.div(dom._class('pad'), dom._class('inlineAttachmentsLine'),
					ui("Attachments: "),
					l.slice(0, filesAll ? l.length : 4).map(a => {
						const name = a.Filename || ui('(unnamed)')
						const viewable = isViewable(a)
						const size = formatSize(a.Part.DecodedSize)
						const eye = '👁'
						const dl = '⤓' // \u2913, actually ⭳ \u2b73 would be better, but in fewer fonts (at least macos)
						const dlurl = 'msg/'+m.ID+'/download/'+[0].concat(a.Path || []).join('.')
						const viewbtn = dom.clickbutton(eye, viewable ? ' '+new String(name) : [], attr.title(ui("View this file. Size: ")+size), function click() {
							view(a)
						})
						const dlbtn = dom.a(dom._class('button'), attr.download(''), attr.href(dlurl), dl, viewable ? [] : ' '+new String(name), attr.title(ui("Download this file. Size: ")+size))
						return dom.span(dom._class('btngroup'), urlType === 'text' && isImage(a) ? style({opacity: '.6'}) : [], viewbtn, dlbtn)
					}),
					filesAll || l.length < 6 ? [] : dom.clickbutton(ui("More..."), function click() {
						filesAll = true
						renderAttachments()
					}), ' ',
					dom.a(ui("Download all as zip"), attr.download(''), style({color: 'inherit'}), attr.href('msg/'+m.ID+'/attachments.zip')),
				),
			)
		)
	}
	renderAttachments()

	const root = dom.div(css('msgViewRoot', {position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column'}))
	dom._kids(root, msgmetaElem, msgcontentElem)

	const loadText = (pm: api.ParsedMessage): void => {
		// We render text ourselves so we can make links clickable and get any selected
		// text to use when writing a reply. We still set url so the text content can be
		// opened in a separate tab, even though it will look differently.
		urlType = 'text'
		const elem = dom.div(dom._class('mono', 'textmulti'),
			style({whiteSpace: 'pre-wrap'}),
			(pm.Texts || []).map(t => renderText(t.replace(/\r\n/g, '\n'))),
			(mi.Attachments || []).filter(f => isImage(f)).map(f => {
				const pathStr = [0].concat(f.Path || []).join('.')
				return dom.div(
					dom.div(
						css('msgAttachmentBox', {flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 'calc(100% - 50px)'}),
						dom.img(
							attr.src('msg/'+m.ID+'/view/'+pathStr),
							attr.title(f.Filename),
							css('msgInlineImage', {boxShadow: styles.boxShadow, maxWidth: '100%', maxHeight: '100%'})
						),
					)
				)
			}),
		)
		dom._kids(msgcontentElem)
		dom._kids(msgscrollElem, elem)
		dom._kids(msgcontentElem, msgscrollElem)
		renderAttachments() // Rerender opacity on inline images.
	}
	const loadHTML = (): void => {
		urlType = 'html'
		dom._kids(msgcontentElem,
			dom.iframe(
				attr.tabindex('0'),
				attr.title(ui("HTML version of message with images inlined, without external resources loaded.")),
				attr.src('msg/'+m.ID+'/'+urlType),
				css('msgIframeHTML', {position: 'absolute', width: '100%', height: '100%'}),
			)
		)
		renderAttachments() // Rerender opacity on inline images.
	}
	const loadHTMLexternal = (): void => {
		urlType = 'htmlexternal'
		dom._kids(msgcontentElem,
			dom.iframe(
				attr.tabindex('0'),
				attr.title(ui("HTML version of message with images inlined and with external resources loaded.")),
				attr.src('msg/'+m.ID+'/'+urlType),
				css('msgIframeHTML', {position: 'absolute', width: '100%', height: '100%'}),
			)
		)
		renderAttachments() // Rerender opacity on inline images.
	}

	const mv: MsgView = {
		root: root,
		messageitem: mi,
		key: keyHandler(shortcuts),
		aborter: { abort: () => {} },
		updateKeywords: async (modseq: number, keywords: string[]) => {
			mi.Message.ModSeq = modseq
			mi.Message.Keywords = keywords
			loadMsgheaderView(msgheaderElem, miv.messageitem, accountSettings.ShowHeaders || [], refineKeyword, false)
			loadMobileHeaderSummary()
		},
	}

	;(async () => {
		let pm: api.ParsedMessage
		if (parsedMessageOpt) {
			pm = parsedMessageOpt
			parsedMessageResolve(pm)
		} else {
			const promise = withStatus(ui("Loading message"), client.withOptions({aborter: mv.aborter}).ParsedMessage(m.ID))
			try {
				pm = await promise
			} catch (err) {
				if (err instanceof Error) {
					parsedMessageReject(err)
				} else {
					parsedMessageReject(new Error(ui("fetching message failed")))
				}
				throw err
			}
			parsedMessageResolve(pm)
		}

		loadButtons(pm)
		loadHeaderDetails(pm)

		const msgHeaderSeparatorStyle = css('msgHeaderSeparator', {borderTop: '1px solid', borderTopColor: styles.borderColor})
		const msgModeWarningStyle = css('msgModeWarning', {backgroundColor: styles.warningBackgroundColor, padding: '0 .15em'})

		const htmlNote = ui('In the HTML viewer, the following potentially dangerous functionality is disabled: submitting forms, starting a download from a link, navigating away from this page by clicking a link. If a link does not work, try explicitly opening it in a new tab.')
		const haveText = pm.Texts && pm.Texts.length > 0
		if (!haveText && !pm.HasHTML) {
			dom._kids(msgcontentElem)
			dom._kids(msgmodeElem,
				dom.div(dom._class('pad'),
					msgHeaderSeparatorStyle,
					dom.span(ui("No textual content"), msgModeWarningStyle),
				),
			)
		} else if (haveText && !pm.HasHTML) {
			loadText(pm)
			dom._kids(msgmodeElem)
		} else {
			const text = haveText && pm.ViewMode == api.ViewMode.ModeText
			dom._kids(msgmodeElem,
				dom.div(dom._class('pad'), dom._class('msgModeBar'),
					msgHeaderSeparatorStyle,
					!haveText ? dom.span(ui("HTML-only message"), attr.title(htmlNote), msgModeWarningStyle) : [],
					dom.span(dom._class('btngroup'),
						haveText ? textbtn=dom.clickbutton(text ? dom._class('active') : [], ui("Text"), clickCmd(cmdShowText, shortcuts)) : [],
						htmlbtn=dom.clickbutton(text || !text && pm.ViewMode == api.ViewMode.ModeHTMLExt ? [] : dom._class('active'), ui("HTML"), attr.title(htmlNote), async function click() {
							// Shortcuts has a function that cycles through html and htmlexternal.
							showShortcut('T')
							await cmdShowHTML()
						}),
						htmlextbtn=dom.clickbutton(text || !text && pm.ViewMode != api.ViewMode.ModeHTMLExt ? [] : dom._class('active'), isMobile() ? ui('HTML ext') : ui('HTML with external resources'), attr.title(htmlNote), clickCmd(cmdShowHTMLExternal, shortcuts)),
					),
				)
			)
			if (text) {
				loadText(pm)
			} else if (pm.ViewMode == api.ViewMode.ModeHTMLExt) {
				loadHTMLexternal()
			} else {
				loadHTML()
			}
		}

		messageLoaded()

		// Add and remove timer id's for marking message as read or non-junk. These id's
		// are canceled when the corresponding messages are permanently removed, to prevent
		// error messages about operations on no longer existing messages.
		const tidAdd = (tid: number) => {
			const l = scheduledTimers.get(miv.messageitem.Message.ID) || []
			l.push(tid)
			scheduledTimers.set(miv.messageitem.Message.ID, l)
		}
		const tidRemove = (tid: number) => {
			const l = scheduledTimers.get(miv.messageitem.Message.ID) || []
			const i = l.indexOf(tid)
			if (i >= 0) {
				l.splice(i, 1)
			}
			if (l.length === 0) {
				scheduledTimers.delete(miv.messageitem.Message.ID)
			}
		}

		if (!miv.messageitem.Message.Seen) {
			const tid = window.setTimeout(async () => {
				if (!miv.messageitem.Message.Seen && miv.messageitem.Message.ID === msglistView.activeMessageID()) {
					await withStatus(ui("Marking current message as read"), client.FlagsAdd([miv.messageitem.Message.ID], ['\\seen']))
				}
				tidRemove(tid)
			}, 500)
			tidAdd(tid)
		}
		if (!miv.messageitem.Message.Junk && !miv.messageitem.Message.Notjunk) {
			const tid = window.setTimeout(async () => {
				const mailboxSpecial = () => !!listMailboxes().find(mb => mb.ID === miv.messageitem.Message.MailboxID && (mb.Name === rejectsMailbox || mb.Name == introboxMailbox))
				if (!miv.messageitem.Message.Junk && !miv.messageitem.Message.Notjunk && miv.messageitem.Message.Seen && miv.messageitem.Message.ID === msglistView.activeMessageID() && !mailboxSpecial()) {
					await withStatus(ui("Marking current message as not junk"), client.FlagsAdd([miv.messageitem.Message.ID], ['$notjunk']))
				}
				tidRemove(tid)
			}, 5*1000)
			tidAdd(tid)
		}
	})()

	return mv
}

// MsglistView holds the list of messages for a mailbox/search query. Zero or more
// messages can be selected (active). If one message is selected, its contents are shown.
// With multiple selected, they can all be operated on, e.g. moved to
// archive/trash/junk. Focus is typically on the last clicked message, but can be
// changed with keyboard interaction without changing selected messages.
//
// With threading enabled, we show the messages in a thread below each other. A
// thread can have multiple "thread roots": messages without a parent message. This
// can occur if a parent message with multiple kids is permanently removed. We also
// show messages from the same thread but a different mailbox. A thread root can be
// collapsed, independently of collapsed state of other thread roots. We order
// thread roots, and kids/siblings, by received timestamp.
//
// For incoming changes (add/remove of messages), we update the thread view in a
// way that resembles a fresh mailbox load as much as possible. Exceptions: If a
// message is removed, and there are thread messages remaining, but they are all in
// other mailboxes (or don't match the search query), we still show the remaining
// messages. If you would load the mailbox/search query again, you would not see
// those remaining messages. Also, if a new message is delivered to a thread, the
// thread isn't moved. After a refresh, the thread would be the most recent (at the
// top for the default sorting).
//
// When updating the UI for threaded messages, we often take this simple approach:
// Remove a subtree of messages from the UI, sort their data structures, and add
// them to the UI again. That saves tricky code that would need to make just the
// exact changes needed.
//
// We just have one MsglistView, that is updated when a different mailbox/search
// query is opened.
interface MsglistView {
	root: HTMLElement
	actionBar: HTMLElement

	updateFlags: (mailboxID: number, uid: number, modseq: number, mask: api.Flags, flags: api.Flags, keywords: string[]) => void
	addMessageItems: (messageItems: (api.MessageItem[] | null)[], isChange: boolean, requestMsgID: number) => void
	removeUIDs: (mailboxID: number, uids: number[]) => void
	updateMessageThreadFields: (messageIDs: number[], muted: boolean, collapsed: boolean) => void
	activeMessageID: () => number // For single message selected, otherwise returns 0.
	redraw: (miv: MsgitemView) => void // To be called after updating flags or focus/active state, rendering it again.
	clear: () => void // Clear all messages, reset focus/active state.
	unselect: () => void
	select: (miv: MsgitemView) => void
	selected: () => MsgitemView[]
	openMessage: (parsedMessage: api.ParsedMessage) => boolean
	click: (miv: MsgitemView, ctrl: boolean, shift: boolean) => void
	key: (k: string, e: KeyboardEvent) => void
	mailboxes: () => api.Mailbox[]
	activeMailbox: () => api.Mailbox | null
	itemHeight: () => number // For calculating how many messageitems to request to load next view.
	threadExpand: (miv: MsgitemView) => void
	threadCollapse: (miv: MsgitemView) => void
	threadToggle: () => void // Toggle threads based on state.
	viewportEnsureMessages: () => Promise<void> // Load more messages if last message is near the end of the viewport.

	// Exported for MsgView.
	cmdArchive: () => Promise<void>
	cmdDelete: () => Promise<void>
	cmdTrash: () => Promise<void>
	cmdJunk: () => Promise<void>
	cmdMarkNotJunk: () => Promise<void>
	cmdMarkRead: () => Promise<void>
	cmdMarkUnread: () => Promise<void>
	cmdMute: () => Promise<void>
	cmdUnmute: () => Promise<void>
}

const newMsglistView = (msgElem: HTMLElement, activeMailbox: () => api.Mailbox | null, listMailboxes: listMailboxes, setLocationHash: setLocationHash, otherMailbox: otherMailbox, possibleLabels: possibleLabels, scrollElemHeight: () => number, refineKeyword: (kw: string) => Promise<void>, viewportEnsureMessages: () => Promise<void>, onMessagePane?: (open: boolean) => void): MsglistView => {
	// msgitemViews holds all visible item views: All thread roots, and kids only if
	// the thread is expanded, in order of descendants. All descendants of a collapsed
	// root are in collapsedMsgitemViews, unsorted. Having msgitemViews as a list is
	// convenient for reasoning about the visible items, and handling changes to the
	// selected messages.
	// When messages for a thread are all non-matching the query, we no longer show it
	// (e.g. when moving a thread to Archive), but we keep the messages around in
	// oldThreadMessageItems, so an update to the thread (e.g. new delivery) can
	// resurrect the messages.
	let msgitemViews: MsgitemView[] = [] // Only visible msgitems, in order on screen.
	let collapsedMsgitemViews: MsgitemView[] = [] // Invisible messages because collapsed, unsorted.
	let oldThreadMessageItems: api.MessageItem[] = [] // Messages from threads removed from view.

	// selected holds the messages that are selected, zero or more. If there is a
	// single message, its content is shown. If there are multiple, just the count is
	// shown. These are in order of being added, not in order of how they are shown in
	// the list. This is needed to handle selection changes with the shift key. For
	// collapsed thread roots, only that root will be in this list. The effective
	// selection must always expand descendants, use mlv.selected() to gather all.
	let selected: MsgitemView[] = []

	// Focus is the message last interacted with, or the first when messages are
	// loaded. Always set when there is a message. Used for shift+click to expand
	// selection.
	let focus: MsgitemView | null = null

	let msgView: MsgView | null = null

	// Messages for actions like "archive", "trash", "move to...". We skip messages
	// that are (already) in skipMBID. And we skip messages that are in the designated
	// Sent mailbox, unless there is only one selected message or the view is for the
	// Sent mailbox, then it must be intentional.
	const moveActionSources = (skipMBID: number) => {
		const sentMailboxID = listMailboxes().find(mb => mb.Sent)?.ID
		const effselected = mlv.selected()
		return effselected
			.filter(miv => miv.messageitem.Message.MailboxID !== skipMBID)
			.map(miv => miv.messageitem.Message)
			.filter(m => effselected.length === 1 || !sentMailboxID || m.MailboxID !== sentMailboxID || !otherMailbox(sentMailboxID))
			.map(m => ({ id: m.ID, mailboxID: m.MailboxID }))
	}

	const cmdArchive = async () => {
		const mb = listMailboxes().find(mb => mb.Archive)
		if (mb) {
			const sources = moveActionSources(mb.ID)
			await withStatus(ui("Moving to archive mailbox"), client.MessageMove(sources.map(s => s.id), mb.ID, true))
			offerMoveUndo(sources)
		} else {
			window.alert(ui("No mailbox configured for archiving yet."))
		}
	}
	const cmdDelete = async () => {
		if (!window.confirm(ui("Are you sure you want to permanently delete?"))) {
			return
		}
		const ids = mlv.selected().map(miv => miv.messageitem.Message.ID)
		forgetMovedMessages(ids)
		// Cancel pending timers that may mark these messages as read or non-junk, to
		// prevent error messages about non-existent (removed) messages.
		for (const id of ids) {
			for (const tid of (scheduledTimers.get(id) || [])) {
				window.clearTimeout(tid)
			}
			scheduledTimers.delete(id)
		}
		await withStatus(ui("Permanently deleting messages"), client.MessageDelete(ids))
	}
	const cmdTrash = async () => {
		const mb = listMailboxes().find(mb => mb.Trash)
		if (mb) {
			const sources = moveActionSources(mb.ID)
			await withStatus(ui("Moving to trash mailbox"), client.MessageMove(sources.map(s => s.id), mb.ID, true))
			offerMoveUndo(sources)
		} else {
			window.alert(ui("No mailbox configured for trash yet."))
		}
	}
	const cmdJunk = async () => {
		const mb = listMailboxes().find(mb => mb.Junk)
		if (mb) {
			const sources = moveActionSources(mb.ID)
			await withStatus(ui("Moving to junk mailbox"), client.MessageMove(sources.map(s => s.id), mb.ID, true))
			offerMoveUndo(sources)
		} else {
			window.alert(ui("No mailbox configured for junk yet."))
		}
	}
	const cmdMarkNotJunk = async () => { await withStatus(ui("Marking as not junk"), client.FlagsAdd(mlv.selected().map(miv => miv.messageitem.Message.ID), ['$notjunk'])) }
	const cmdMarkRead = async () => { await withStatus(ui("Marking as read"), client.FlagsAdd(mlv.selected().map(miv => miv.messageitem.Message.ID), ['\\seen'])) }
	const cmdMarkUnread = async () => { await withStatus(ui("Marking as not read"), client.FlagsClear(mlv.selected().map(miv => miv.messageitem.Message.ID), ['\\seen', '$junk', '$notjunk'])) }
	const cmdMute = async () => {
		const l = mlv.selected()
		await withStatus(ui("Muting thread"), client.ThreadMute(l.map(miv => miv.messageitem.Message.ID), true))
		const oldstate = state()
		for (const miv of l) {
			if (!miv.parent && miv.kids.length > 0 && !miv.collapsed) {
				threadCollapse(miv, false)
			}
		}
		updateState(oldstate)
		viewportEnsureMessages()
	}
	const cmdUnmute = async () => { await withStatus(ui("Unmuting thread"), client.ThreadMute(mlv.selected().map(miv => miv.messageitem.Message.ID), false)) }

	const selectedRoots = () => {
		const mivs: MsgitemView[] = []
		mlv.selected().forEach(miv => {
			const mivroot = miv.threadRoot()
			if (!mivs.includes(mivroot)) {
				mivs.push(mivroot)
			}
		})
		return mivs
	}

	const cmdToggleMute = async () => {
		if (settings.threading === api.ThreadMode.ThreadOff) {
			alert(ui("Toggle muting threads is only available when threading is enabled."))
			return
		}
		const rootmivs = selectedRoots()
		const unmuted = !!rootmivs.find(miv => !miv.messageitem.Message.ThreadMuted)
		await withStatus(unmuted ? 'Muting' : 'Unmuting', client.ThreadMute(rootmivs.map(miv => miv.messageitem.Message.ID), unmuted ? true : false))
		if (unmuted) {
			const oldstate = state()
			rootmivs.forEach(miv => {
				if (!miv.collapsed) {
					threadCollapse(miv, false)
				}
			})
			updateState(oldstate)
			viewportEnsureMessages()
		}
	}

	const cmdToggleCollapse = async () => {
		if (settings.threading === api.ThreadMode.ThreadOff) {
			alert(ui("Toggling thread collapse/expand is only available when threading is enabled."))
			return
		}

		const rootmivs = selectedRoots()
		const collapse = !!rootmivs.find(miv => !miv.collapsed)

		const oldstate = state()
		if (collapse) {
			rootmivs.forEach(miv => {
				if (!miv.collapsed) {
					threadCollapse(miv, false)
				}
			})
			selected = rootmivs
			if (focus) {
				focus = focus.threadRoot()
			}
			viewportEnsureMessages()
		} else {
			rootmivs.forEach(miv => {
				if (miv.collapsed) {
					threadExpand(miv, false)
				}
			})
		}
		updateState(oldstate)

		if (settings.threading === api.ThreadMode.ThreadOn) {
			const action = collapse ? 'Collapsing' : 'Expanding'
			await withStatus(action, client.ThreadCollapse(rootmivs.map(miv => miv.messageitem.Message.ID), collapse))
		}
	}

	const cmdSelectThread = async () => {
		if (!focus) {
			return
		}

		const oldstate = state()
		selected = msgitemViews.filter(miv => miv.messageitem.Message.ThreadID === focus!.messageitem.Message.ThreadID)
		updateState(oldstate)
	}

	const cmdCollapseExpand = async (collapse: boolean) => {
		if (settings.threading === api.ThreadMode.ThreadOff) {
			alert(ui("Toggling thread collapse/expand is only available when threading is enabled."))
			return
		}
		const oldstate = state()
		const rootmivs = selectedRoots()
		rootmivs.forEach(miv => {
			if (miv.collapsed !== collapse) {
				if (collapse) {
					threadCollapse(miv, false)
				} else {
					threadExpand(miv, false)
				}
			}
		})
		if (collapse) {
			selected = rootmivs
			if (focus) {
				focus = focus.threadRoot()
			}
		}
		viewportEnsureMessages()
		updateState(oldstate)
		if (settings.threading === api.ThreadMode.ThreadOn) {
			const action = collapse ? 'Collapsing' : 'Expanding'
			await withStatus(action, client.ThreadCollapse(rootmivs.map(miv => miv.messageitem.Message.ID), collapse))
		}
	}
	const cmdCollapse = async () => cmdCollapseExpand(true)
	const cmdExpand = async () => cmdCollapseExpand(false)

	const shortcuts: {[key: string]: command} = {
		d: cmdTrash,
		Delete: cmdTrash,
		D: cmdDelete,
		a: cmdArchive,
		q: cmdJunk,
		Q: cmdMarkNotJunk,
		m: cmdMarkRead,
		M: cmdMarkUnread,
		X: cmdToggleMute,
		C: cmdToggleCollapse,
		S: cmdSelectThread,
		ArrowLeft: cmdCollapse,
		ArrowRight: cmdExpand,
	}

	// After making changes, this function looks through the data structure for
	// inconsistencies. Useful during development.
	const checkConsistency = (checkSelection: boolean) => {
		if (!settings.checkConsistency) {
			return
		}

		// Check for duplicates in msgitemViews.
		const mivseen = new Set<number>()
		const threadActive = new Set<number>()
		for (const miv of msgitemViews) {
			const id = miv.messageitem.Message.ID
			if (mivseen.has(id)) {
				log('duplicate Message.ID', {id: id, mivseenSize: mivseen.size})
				throw new ConsistencyError('duplicate Message.ID in msgitemViews')
			}
			mivseen.add(id)
			if (!miv.root.parentNode) {
				throw new ConsistencyError('msgitemView.root not in dom')
			}
			threadActive.add(miv.messageitem.Message.ThreadID)
		}

		// Check for duplicates in collapsedMsgitemViews, and whether also in msgitemViews.
		const colseen = new Set<number>()
		for (const miv of collapsedMsgitemViews) {
			const id = miv.messageitem.Message.ID
			if (colseen.has(id)) {
				throw new ConsistencyError('duplicate Message.ID in collapsedMsgitemViews')
			}
			colseen.add(id)
			if (mivseen.has(id)) {
				throw new ConsistencyError('Message.ID in both collapsedMsgitemViews and msgitemViews')
			}
			threadActive.add(miv.messageitem.Message.ThreadID)
		}

		if (settings.threading !== api.ThreadMode.ThreadOff) {
			const oldseen = new Set<number>()
			for (const mi of oldThreadMessageItems) {
				const id = mi.Message.ID
				if (oldseen.has(id)) {
					throw new ConsistencyError('duplicate Message.ID in oldThreadMessageItems')
				}
				oldseen.add(id)
				if (mivseen.has(id)) {
					throw new ConsistencyError('Message.ID in both msgitemViews and oldThreadMessageItems')
				}
				if (colseen.has(id)) {
					throw new ConsistencyError('Message.ID in both collapsedMsgitemViews and oldThreadMessageItems')
				}

				if (threadActive.has(mi.Message.ThreadID)) {
					throw new ConsistencyError('threadid both in active and in old thread list')
				}
			}
		}

		// Walk all (collapsed) msgitemViews, check each and their descendants are in
		// msgitemViews at the correct position, or in collapsedmsgitemViews.
		msgitemViews.forEach((miv, i) => {
			if (miv.collapsed) {
				for (const dmiv of miv.descendants()) {
					if (!colseen.has(dmiv.messageitem.Message.ID)) {
						throw new ConsistencyError('descendant message id missing from collapsedMsgitemViews')
					}
				}
				return
			}
			for (const dmiv of miv.descendants()) {
				i++
				if (!mivseen.has(dmiv.messageitem.Message.ID)) {
					throw new ConsistencyError('descendant missing from msgitemViews')
				}
				if (msgitemViews[i] !== dmiv) {
					throw new ConsistencyError('descendant not at expected position in msgitemViews')
				}
			}
		})

		if (!checkSelection) {
			return
		}

		// Check all selected & focus exists.
		const selseen = new Set<number>()
		for (const miv of selected) {
			const id = miv.messageitem.Message.ID
			if (selseen.has(id)) {
				throw new ConsistencyError('duplicate miv in selected')
			}
			selseen.add(id)
			if (!mivseen.has(id)) {
				throw new ConsistencyError('selected id not in msgitemViews')
			}
		}
		if (focus) {
			const id = focus.messageitem.Message.ID
			if (!mivseen.has(id)) {
				throw new ConsistencyError('focus set to unknown miv')
			}
		}
	}

	type state = {
		active: {[id: string]: MsgitemView},
		focus: MsgitemView | null
	}

	// Return active & focus state, and update the UI after changing state.
	const state = (): state => {
		const active: {[key: string]: MsgitemView} = {}
		for (const miv of mlv.selected()) {
			active[miv.messageitem.Message.ID] = miv
		}
		return {active: active, focus: focus}
	}
	const listActionBar = dom.div(
		dom._class('msgListActionBar'),
		attr.role('region'),
		attr.arialabel('Actions for selected messages'),
	)
	const fillListActionBar = (rows: MsgitemView[]) => {
		if (rows.length < 2) {
			listActionBar.classList.remove('isOpen')
			dom._kids(listActionBar)
			return
		}
		const trashMailboxID = listMailboxes().find(mb => mb.Trash)?.ID
		const allTrash = trashMailboxID && !rows.find(miv => miv.messageitem.Message.MailboxID !== trashMailboxID)
		const sentMailboxID = listMailboxes().find(mb => mb.Sent)?.ID
		const movable = rows.map(miv => miv.messageitem.Message).filter(m => rows.length === 1 || !sentMailboxID || m.MailboxID !== sentMailboxID || !otherMailbox(sentMailboxID))
		listActionBar.classList.add('isOpen')
		dom._kids(listActionBar,
			dom.clickbutton(ui("Archive"), attr.title(ui("Move to the Archive mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdArchive, shortcuts)),
			allTrash ?
				dom.clickbutton(ui("Delete"), attr.title(ui("Permanently delete messages.")), clickCmd(cmdDelete, shortcuts)) :
				dom.clickbutton(ui("Trash"), attr.title(ui("Move to the Trash mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdTrash, shortcuts)),
			dom.clickbutton(ui("More"), attr.title(ui("More actions.")), function click(e: MouseEvent) {
				menuPopover(e.target! as HTMLElement, [
					dom.clickbutton(ui("Junk"), attr.title(ui("Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdJunk, shortcuts)),
					dom.clickbutton(ui("Move to..."), function click(ev: MouseEvent) {
						movePopover(ev, listMailboxes(), movable)
					}),
					dom.clickbutton(ui("Labels..."), attr.title(ui("Add/remove labels ...")), function click(ev: MouseEvent) {
						labelsPopover(ev, rows.map(miv => miv.messageitem.Message), possibleLabels)
					}),
					dom.clickbutton(ui("Mark Read"), clickCmd(cmdMarkRead, shortcuts)),
					dom.clickbutton(ui("Mark Unread"), clickCmd(cmdMarkUnread, shortcuts)),
					dom.clickbutton(ui("Mark Not Junk"), attr.title(ui("Mark as not junk, causing this message to be used in spam classification of new incoming messages.")), clickCmd(cmdMarkNotJunk, shortcuts)),
					dom.clickbutton(ui("Mute thread"), clickCmd(cmdMute, shortcuts)),
					dom.clickbutton(ui("Unmute thread"), clickCmd(cmdUnmute, shortcuts)),
					dom.clickbutton(ui("Export as..."), function click(ev: {target: HTMLElement}) {
						popoverExport(ev.target, '', rows.map(miv => miv.messageitem.Message.ID))
					}),
				])
			}),
		)
	}

	const updateState = async (oldstate: state, initial?: boolean, parsedMessageOpt?: api.ParsedMessage): Promise<void> => {
		// Set new focus & active classes.
		const newstate = state()
		if (oldstate.focus !== newstate.focus) {
			if (oldstate.focus) {
				oldstate.focus.root.classList.toggle('focus', false)
			}
			if (newstate.focus) {
				newstate.focus.root.classList.toggle('focus', true)
				newstate.focus.root.scrollIntoView({block: initial ? 'center' : 'nearest'})
			}
		}
		let activeChanged = false
		for (const id in oldstate.active) {
			if (!newstate.active[id]) {
				oldstate.active[id].root.classList.toggle('active', false)
				activeChanged = true
			}
		}
		for (const id in newstate.active) {
			if (!oldstate.active[id]) {
				newstate.active[id].root.classList.toggle('active', true)
				activeChanged = true
			}
		}

		const effselected = mlv.selected()
		if (initial && effselected.length === 1) {
			mlv.redraw(effselected[0])
		}

		checkConsistency(true)

		if (!activeChanged) {
			return
		}
		if (msgView) {
			msgView.aborter.abort()
		}
		msgView = null

		fillListActionBar(effselected)
		if (effselected.length === 0) {
			dom._kids(msgElem)
		} else if (effselected.length === 1) {
			msgElem.classList.toggle('loading', true)
			const loaded = () => { msgElem.classList.toggle('loading', false) }
			msgView = newMsgView(effselected[0], mlv, listMailboxes, setLocationHash, possibleLabels, loaded, refineKeyword, parsedMessageOpt)
			dom._kids(msgElem, msgView)
		} else {
			dom._kids(msgElem,
				dom.div(
					attr.role('region'), attr.arialabel(ui("Selected messages")),
					css('msgSelectionNote', {padding: '2em', textAlign: 'center', color: styles.colorMild}),
					selectedTitle(effselected.length),
				),
			)
		}
		setLocationHash()
		if (activeChanged && onMessagePane && isMobile()) {
			onMessagePane(effselected.length === 1)
		}
	}

	// Moves the currently focused msgitemView, without changing selection.
	const moveFocus = (miv: MsgitemView) => {
		const oldstate = state()
		focus = miv
		updateState(oldstate)
	}

	const threadExpand = (miv: MsgitemView, changeState: boolean) => {
		if (miv.parent) {
			throw new ConsistencyError('cannot expand non-root')
		}

		const oldstate = state()

		miv.collapsed = false
		const mivl = miv.descendants()
		miv.render()
		mivl.forEach(dmiv => dmiv.render())
		for (const miv of mivl) {
			collapsedMsgitemViews.splice(collapsedMsgitemViews.indexOf(miv), 1)
		}
		const pi = msgitemViews.indexOf(miv)
		msgitemViews.splice(pi+1, 0, ...mivl)
		const next = miv.root.nextSibling
		for (const miv of mivl) {
			mlv.root.insertBefore(miv.root, next)
		}

		if (changeState) {
			updateState(oldstate)
		}
	}
	const threadCollapse = (miv: MsgitemView, changeState: boolean) => {
		if (miv.parent) {
			throw new ConsistencyError('cannot expand non-root')
		}
		const oldstate = state()

		miv.collapsed = true
		const mivl = miv.descendants()

		collapsedMsgitemViews.push(...mivl)
		// If miv or any child was selected, ensure collapsed thread root is also selected.
		let select = [miv, ...mivl].find(xmiv => selected.indexOf(xmiv) >= 0)
		let seli = selected.length // Track first index of already selected miv, which is where we insert the thread root if needed, to keep order.
		msgitemViews.splice(msgitemViews.indexOf(miv)+1, mivl.length)
		for (const dmiv of mivl) {
			dmiv.remove()

			if (focus === dmiv) {
				focus = miv
			}
			const si = selected.indexOf(dmiv)
			if (si >= 0) {
				if (si < seli) {
					seli = si
				}
				selected.splice(si, 1)
			}
		}
		if (select) {
			const si = selected.indexOf(miv)
			if (si < 0) {
				selected.splice(seli, 0, miv)
			}
		}

		// Selected messages may have changed.
		if (changeState) {
			updateState(oldstate)
		}

		// Render remaining thread root, with tree size, effective received age/unread state.
		miv.render()
	}

	const threadToggle = () => {
		const oldstate = state()
		const roots = msgitemViews.filter(miv => !miv.parent && miv.kids.length > 0)
		roots.forEach(miv => {
			let wantCollapsed = miv.messageitem.Message.ThreadCollapsed
			if (settings.threading === api.ThreadMode.ThreadUnread) {
				wantCollapsed = !miv.messageitem.Message.Seen && !miv.findDescendant(miv => !miv.messageitem.Message.Seen)
			}
			if (miv.collapsed === wantCollapsed) {
				return
			}
			if (wantCollapsed) {
				threadCollapse(miv, false)
			} else {
				threadExpand(miv, false)
			}
		})
		updateState(oldstate)
		viewportEnsureMessages()
	}

	const removeSelected = (miv: MsgitemView) => {
		const si = selected.indexOf(miv)
		if (si >= 0) {
			selected.splice(si, 1)
		}
		if (focus === miv) {
			const i = msgitemViews.indexOf(miv)
			if (i > 0) {
				focus = msgitemViews[i-1]
			} else if (i+1 < msgitemViews.length) {
				focus = msgitemViews[i+1]
			} else {
				focus = null
			}
		}
	}

	// Removes message from either msgitemViews, collapsedMsgitemViews,
	// oldThreadMessageItems, and updates UI.
	// Returns ThreadID of removed message if active (expanded or collapsed), or 0 otherwise.
	const removeUID = (mailboxID: number, uid: number) => {
		const match = (miv: MsgitemView) => miv.messageitem.Message.MailboxID === mailboxID && miv.messageitem.Message.UID === uid

		const ci = collapsedMsgitemViews.findIndex(match)
		if (ci >= 0) {
			const miv = collapsedMsgitemViews[ci]
			removeCollapsed(ci)
			return miv.messageitem.Message.ThreadID
		}

		const i = msgitemViews.findIndex(match)
		if (i >= 0) {
			const miv = msgitemViews[i]
			removeExpanded(i)
			return miv.messageitem.Message.ThreadID
		}

		const ti = oldThreadMessageItems.findIndex(mi => mi.Message.MailboxID === mailboxID && mi.Message.UID === uid)
		if (ti >= 0) {
			oldThreadMessageItems.splice(ti, 1)
		}
		return 0
	}

	// Removes message from collapsedMsgitemView and UI at given index, placing
	// messages in oldThreadMessageItems.
	const removeCollapsed = (ci: number) => {
		// Message is collapsed. That means it isn't visible, and neither are its children,
		// and it has a parent. So we just merge the kids with those of the parent.
		const miv = collapsedMsgitemViews[ci]
		collapsedMsgitemViews.splice(ci, 1)
		removeSelected(miv)
		const trmiv = miv.threadRoot() // To rerender, below.
		const pmiv = miv.parent
		if (!pmiv) {
			throw new ConsistencyError('removing collapsed miv, but has no parent')
		}
		miv.parent = null // Strict cleanup.
		const pki = pmiv.kids.indexOf(miv)
		if (pki < 0) {
			throw new ConsistencyError('miv not in parent.kids')
		}
		pmiv.kids.splice(pki, 1, ...miv.kids) // In parent, replace miv with its kids.
		miv.kids.forEach(kmiv => kmiv.parent = pmiv) // Give kids their new parent.
		miv.kids = [] // Strict cleanup.
		pmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime()) // Sort new list of kids.
		trmiv.render() // For count, unread state.
		return
	}

	// Remove message from msgitemViews and UI at the index i.
	const removeExpanded = (i: number) => {
		log('removeExpanded', {i})
		// Note: If we remove a message we may be left with only messages from another
		// mailbox. We'll leave it, new messages could be delivered for that thread. It
		// would be strange to see the remaining messages of the thread disappear.

		const miv = msgitemViews[i]
		removeSelected(miv)
		const pmiv = miv.parent
		miv.parent = null
		if (miv.kids.length === 0) {
			// No kids, easy case, just remove this leaf message.
			miv.remove()
			msgitemViews.splice(i, 1)
			if (pmiv) {
				const pki = pmiv.kids.indexOf(miv)
				if (pki < 0) {
					throw new ConsistencyError('miv not in parent.kids')
				}
				pmiv.kids.splice(pki, 1) // Remove miv from parent's kids.
				miv.parent = null // Strict cleanup.
				pmiv.render() // Update counts.
			}
			return
		}
		if (!pmiv) {
			// If the kids no longer have a parent and become thread roots we leave them in
			// their original location.
			const next = miv.root.nextSibling
			miv.remove()
			msgitemViews.splice(i, 1)
			if (miv.collapsed) {
				msgitemViews.splice(i, 0, ...miv.kids)
				for (const kmiv of miv.kids) {
					const pki = collapsedMsgitemViews.indexOf(kmiv)
					if (pki < 0) {
						throw new ConsistencyError('cannot find collapsed kid in collapsedMsgitemViews')
					}
					collapsedMsgitemViews.splice(pki, 1)
					kmiv.collapsed = true
					kmiv.parent = null
					kmiv.render()
					mlv.root.insertBefore(kmiv.root, next)
				}
			} else {
				// Note: if not collapsed, we leave the kids in the original position in msgitemViews.
				miv.kids.forEach(kmiv => {
					kmiv.collapsed = false
					kmiv.parent = null
					kmiv.render()
					const lastDesc = kmiv.lastDescendant()
					if (lastDesc) {
						// Update end of thread bar.
						lastDesc.render()
					}
				})
			}
			miv.kids = [] // Strict cleanup.
			return
		}

		// If the kids will have a parent, we insert them at the expected location in
		// between parent's existing kids. It is easiest just to take out all kids, add the
		// new ones, sort kids, and add back the subtree.
		const odmivs = pmiv.descendants() // Old direct descendants of parent. This includes miv and kids, and other kids, and miv siblings.
		const pi = msgitemViews.indexOf(pmiv)
		if (pi < 0) {
			throw new ConsistencyError('cannot find parent of removed miv')
		}
		msgitemViews.splice(pi+1, odmivs.length) // Remove all old descendants, we'll add an updated list later.
		const pki = pmiv.kids.indexOf(miv)
		if (pki < 0) {
			throw new Error('did not find miv in parent.kids')
		}
		pmiv.kids.splice(pki, 1) // Remove miv from parent's kids.
		pmiv.kids.push(...miv.kids) // Add miv.kids to parent's kids.
		miv.kids.forEach(kmiv => { kmiv.parent = pmiv }) // Set new parent for miv kids.
		miv.kids = [] // Strict cleanup.
		pmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime())
		const ndmivs = pmiv.descendants() // Excludes miv, that we are removing.
		if (ndmivs.length !== odmivs.length-1) {
			throw new ConsistencyError('unexpected new descendants counts during remove')
		}
		msgitemViews.splice(pi+1, 0, ...ndmivs) // Add all new/current descendants. There is one less than in odmivs.
		odmivs.forEach(ndimv => ndimv.remove())
		const next = pmiv.root.nextSibling
		for (const ndmiv of ndmivs) {
			mlv.root.insertBefore(ndmiv.root, next)
		}
		pmiv.render()
		ndmivs.forEach(dmiv => dmiv.render())
	}


	// If there are no query-matching messages left for this thread, remove the
	// remaining messages from view and keep them around for future deliveries for the
	// thread.
	const possiblyTakeoutOldThreads = (threadIDs: Set<number>) => {
		const hasMatch = (mivs: MsgitemView[], threadID: number) => mivs.find(miv => miv.messageitem.Message.ThreadID === threadID && miv.messageitem.MatchQuery)
		const takeoutOldThread = (mivs: MsgitemView[], threadID: number, visible: boolean) => {
			let i = 0
			while (i < mivs.length) {
				const miv = mivs[i]
				const mi = miv.messageitem
				const m = mi.Message
				if (threadID !== m.ThreadID) {
					i++
					continue
				}
				mivs.splice(i, 1)
				if (visible) {
					miv.remove()
				}
				if (focus === miv) {
					focus = null
					if (i < mivs.length) {
						focus = mivs[i]
					} else if (i > 0) {
						focus = mivs[i-1]
					}
				}
				const si = selected.indexOf(miv)
				if (si >= 0) {
					selected.splice(si, 1)
				}
				// Strict cleanup.
				miv.parent = null
				miv.kids = []
				oldThreadMessageItems.push(mi)
				log('took out old thread message', {mi})
			}
		}

		for (const threadID of threadIDs) {
			if (hasMatch(msgitemViews, threadID) || hasMatch(collapsedMsgitemViews, threadID)) {
				log('still have query-matching message for thread', {threadID})
				continue
			}
			takeoutOldThread(msgitemViews, threadID, true)
			takeoutOldThread(collapsedMsgitemViews, threadID, false)
		}
	}

	const mlv: MsglistView = {
		root: dom.div(),

		updateFlags: (mailboxID: number, uid: number, modseq: number, mask: api.Flags, flags: api.Flags, keywords: string[]) => {
			const updateMessageFlags = (m: api.Message) => {
				m.ModSeq = modseq
				const maskobj = mask as unknown as {[key: string]: boolean}
				const flagsobj = flags as unknown as {[key: string]: boolean}
				const mobj = m as unknown as {[key: string]: boolean}
				for (const k in maskobj) {
					if (maskobj[k]) {
						mobj[k] = flagsobj[k]
					}
				}
				m.Keywords = keywords
			}

			// todo optimize: keep mapping of uid to msgitemView for performance. instead of using Array.find
			let miv = msgitemViews.find(miv => miv.messageitem.Message.MailboxID === mailboxID && miv.messageitem.Message.UID === uid)
			if (!miv) {
				miv = collapsedMsgitemViews.find(miv => miv.messageitem.Message.MailboxID === mailboxID && miv.messageitem.Message.UID === uid)
			}
			if (miv) {
				updateMessageFlags(miv.messageitem.Message)
				miv.render()
				if (miv.parent) {
					const tr = miv.threadRoot()
					if (tr.collapsed) {
						tr.render()
					}
				}
				if (msgView && msgView.messageitem.Message.ID === miv.messageitem.Message.ID) {
					msgView.updateKeywords(modseq, keywords)
				}
				return
			}
			const mi = oldThreadMessageItems.find(mi => mi.Message.MailboxID === mailboxID && mi.Message.UID === uid)
			if (mi) {
				updateMessageFlags(mi.Message)
			} else {
				// Happens for messages outside of view.
				log('could not find msgitemView for uid', uid)
			}
		},

		// Add messages to view, either messages to fill the view with complete threads, or
		// individual messages delivered later.
		addMessageItems: (messageItems: (api.MessageItem[] | null)[], isChange: boolean, requestMsgID: number) => {
			if (messageItems.length === 0) {
				return
			}

			// Each "mil" is a thread, possibly with multiple thread roots. The thread may
			// already be present.
			messageItems.forEach(mil => {
				if (!mil) {
					return // For types, should not happen.
				}

				const threadID = mil[0].Message.ThreadID

				const hasMatch = !!mil.find(mi => mi.MatchQuery)
				if (hasMatch) {
					// This may be a message for a thread that had query-matching matches at some
					// point, but then no longer, causing its messages to have been moved to
					// oldThreadMessageItems. We add back those messages.
					let i = 0
					while (i < oldThreadMessageItems.length) {
						const omi = oldThreadMessageItems[i]
						if (omi.Message.ThreadID === threadID) {
							oldThreadMessageItems.splice(i, 1)
							if (!mil.find(mi => mi.Message.ID === omi.Message.ID)) {
								mil.push(omi)
								log('resurrected old message')
							} else {
								log('dropped old thread message')
							}
						} else {
							i++
						}
					}
				} else {
					// New message(s) are not matching query. If there are no "active" messages for
					// this thread, update/add oldThreadMessageItems.
					const match = (miv: MsgitemView) => miv.messageitem.Message.ThreadID === threadID
					if (!msgitemViews.find(match) && !collapsedMsgitemViews.find(match)) {
						log('adding new message(s) to oldTheadMessageItems')
						for (const mi of mil) {
							const ti = oldThreadMessageItems.findIndex(tmi => tmi.Message.ID === mi.Message.ID)
							if (ti) {
								oldThreadMessageItems[ti] = mi
							} else {
								oldThreadMessageItems.push(mi)
							}
						}
						return
					}
				}

				if (isChange) {
					// This could be an "add" for a message from another mailbox that we are already
					// displaying because of threads. If so, it may have new properties such as the
					// mailbox, so update it.
					const threadIDs = new Set<number>()
					let i = 0
					while (i < mil.length) {
						const mi = mil[i]
						let miv = msgitemViews.find(miv => miv.messageitem.Message.ID === mi.Message.ID)
						if (!miv) {
							miv = collapsedMsgitemViews.find(miv => miv.messageitem.Message.ID === mi.Message.ID)
						}
						if (miv) {
							miv.messageitem = mi
							miv.render()
							mil.splice(i, 1)
							miv.threadRoot().render()
							threadIDs.add(mi.Message.ThreadID)
						} else {
							i++
						}
					}
					log('processed changes for messages with thread', {threadIDs, mil})
					if (mil.length === 0) {
						const oldstate = state()
						possiblyTakeoutOldThreads(threadIDs)
						updateState(oldstate)
						return
					}
				}

				// Find effective receive time for messages. We'll insert at that point.
				let receivedTime = mil[0].Message.Received.getTime()
				const tmiv = msgitemViews.find(miv => miv.messageitem.Message.ThreadID === mil[0].Message.ThreadID)
				if (tmiv) {
					receivedTime = tmiv.receivedTime
				} else {
					for (const mi of mil) {
						const t = mi.Message.Received.getTime()
						if (settings.orderAsc && t < receivedTime || !settings.orderAsc && t > receivedTime) {
							receivedTime = t
						}
					}
				}

				// Create new MsgitemViews.
				const m = new Map<number, MsgitemView>()
				for (const mi of mil) {
					m.set(mi.Message.ID, newMsgitemView(mi, mlv, otherMailbox, listMailboxes, receivedTime, false))
				}

				// Assign miv's to parents or add them to the potential roots.
				let roots: MsgitemView[] = []
				if (settings.threading === api.ThreadMode.ThreadOff) {
					roots = [...m.values()]
				} else {
				nextmiv:
					for (const [_, miv] of m) {
						for (const pid of (miv.messageitem.Message.ThreadParentIDs || [])) {
							const pmiv = m.get(pid)
							if (pmiv) {
								pmiv.kids.push(miv)
								miv.parent = pmiv
								continue nextmiv
							}
						}
						roots.push(miv)
					}
				}

				// Ensure all kids are properly sorted, always ascending by time received.
				for (const [_, miv] of m) {
					miv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime())
				}

				// Add the potential roots as kids to existing parents, if they exist. Only with threading enabled.
				if (settings.threading !== api.ThreadMode.ThreadOff) {
				nextroot:
					for (let i = 0; i < roots.length; ) {
						const miv = roots[i]
						for (const pid of (miv.messageitem.Message.ThreadParentIDs || [])) {
							const pi = msgitemViews.findIndex(xmiv => xmiv.messageitem.Message.ID === pid)
							let parentmiv: MsgitemView | undefined
							let collapsed: boolean
							if (pi >= 0) {
								parentmiv = msgitemViews[pi]
								collapsed = parentmiv.collapsed
								log('found parent', {pi})
							} else {
								parentmiv = collapsedMsgitemViews.find(xmiv => xmiv.messageitem.Message.ID === pid)
								collapsed = true
							}
							if (!parentmiv) {
								log('no parentmiv', pid)
								continue
							}

							const trmiv = parentmiv.threadRoot()
							if (collapsed !== trmiv.collapsed) {
								log('collapsed mismatch', {collapsed: collapsed, 'trmiv.collapsed': trmiv.collapsed, trmiv: trmiv})
								throw new ConsistencyError('mismatch between msgitemViews/collapsedMsgitemViews and threadroot collapsed')
							}
							let prevLastDesc: MsgitemView | null = null
							if (!trmiv.collapsed) {
								// Remove current parent, we'll insert again after linking parent/kids.
								const ndesc = parentmiv.descendants().length
								log('removing descendants temporarily', {ndesc})
								prevLastDesc = parentmiv.lastDescendant()
								msgitemViews.splice(pi+1, ndesc)
							}

							// Link parent & kid, sort kids.
							miv.parent = parentmiv
							parentmiv.kids.push(miv)
							parentmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime())

							if (trmiv.collapsed) {
								// Thread root is collapsed.
								collapsedMsgitemViews.push(miv, ...miv.descendants())

								// Ensure mivs have a root.
								miv.render()
								miv.descendants().forEach(miv => miv.render())

								// Update count/unread status.
								trmiv.render()
							} else {
								const desc = parentmiv.descendants()
								log('inserting parent descendants again', {pi, desc})
								msgitemViews.splice(pi+1, 0, ...desc) // We had removed the old tree, now adding the updated tree.

								// Insert at correct position in dom.
								const i = msgitemViews.indexOf(miv)
								if (i < 0) {
									throw new ConsistencyError('cannot find miv just inserted')
								}
								const l = [miv, ...miv.descendants()]
								// Ensure mivs have valid root.
								l.forEach(miv => miv.render())
								const next = i+1 < msgitemViews.length ? msgitemViews[i+1].root : null
								log('inserting l before next, or appending', {next, l})
								if (next) {
									for (const miv of l) {
										log('inserting miv', {root: miv.root, before: next})
										mlv.root.insertBefore(miv.root, next)
									}
								} else {
									mlv.root.append(...l.map(e => e.root))
								}
								// For beginning/end of thread bar.
								msgitemViews[i-1].render()
								if (prevLastDesc) {
									prevLastDesc.render()
								}
							}
							roots.splice(i, 1)
							continue nextroot
						}
						i++
					}
				}

				// Sort the remaining new roots by their receive times.
				const sign = settings.threading === api.ThreadMode.ThreadOff && settings.orderAsc ? -1 : 1
				roots.sort((miva, mivb) => sign * (mivb.messageitem.Message.Received.getTime() - miva.messageitem.Message.Received.getTime()))

				// Find place to insert, based on thread receive time.
				let nextmivindex: number
				if (tmiv) {
					nextmivindex = msgitemViews.indexOf(tmiv.threadRoot())
				} else {
					nextmivindex = msgitemViews.findIndex(miv => !settings.orderAsc && miv.receivedTime <= receivedTime || settings.orderAsc && receivedTime <= miv.receivedTime)
				}

				for (const miv of roots) {
					miv.collapsed = settings.threading === api.ThreadMode.ThreadOn && miv.messageitem.Message.ThreadCollapsed
					if (settings.threading === api.ThreadMode.ThreadUnread) {
						miv.collapsed = miv.messageitem.Message.Seen && !miv.findDescendant(dmiv => !dmiv.messageitem.Message.Seen)
					}
					if (requestMsgID > 0 && miv.collapsed) {
						miv.collapsed = !miv.findDescendant(dmiv => dmiv.messageitem.Message.ID === requestMsgID)
					}

					const takeThreadRoot = (xmiv: MsgitemView): number => {
						log('taking threadRoot', {id: xmiv.messageitem.Message.ID})
						// Remove subtree from dom.
						const xdmiv = xmiv.descendants()
						xdmiv.forEach(xdmiv => xdmiv.remove())
						xmiv.remove()
						// Link to new parent.
						miv.kids.push(xmiv)
						xmiv.parent = miv
						miv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime())
						return 1+xdmiv.length
					}

					if (settings.threading !== api.ThreadMode.ThreadOff) {
						// We may have to take out existing threadroots and place them under this new root.
						// Because when we move a threadroot, we first remove it, then add it again.
						for (let i = 0; i < msgitemViews.length; ) {
							const xmiv = msgitemViews[i]
							if (!xmiv.parent && xmiv.messageitem.Message.ThreadID === miv.messageitem.Message.ThreadID && (xmiv.messageitem.Message.ThreadParentIDs || []).includes(miv.messageitem.Message.ID)) {
								msgitemViews.splice(i, takeThreadRoot(xmiv))
								nextmivindex = i
							} else {
								i++
							}
						}
						for (let i = 0; i < collapsedMsgitemViews.length; ) {
							const xmiv = collapsedMsgitemViews[i]
							if (!xmiv.parent && xmiv.messageitem.Message.ThreadID === miv.messageitem.Message.ThreadID && (xmiv.messageitem.Message.ThreadParentIDs || []).includes(miv.messageitem.Message.ID)) {
								takeThreadRoot(xmiv)
								collapsedMsgitemViews.splice(i, 1)
							} else {
								i++
							}
						}
					}

					let l = miv.descendants()

					miv.render()
					l.forEach(kmiv => kmiv.render())

					if (miv.collapsed) {
						collapsedMsgitemViews.push(...l)
						l = [miv]
					} else {
						l = [miv, ...l]
					}

					if (nextmivindex < 0) {
						mlv.root.append(...l.map(miv => miv.root))
						msgitemViews.push(...l)
					} else {
						const next = msgitemViews[nextmivindex].root
						for (const miv of l) {
							mlv.root.insertBefore(miv.root, next)
						}
						msgitemViews.splice(nextmivindex, 0, ...l)
					}
				}
			})

			if (!isChange) {
				return
			}

			const oldstate = state()
			if (!focus) {
				focus = msgitemViews[0]
			}
			if (selected.length === 0) {
				if (focus) {
					selected = [focus]
				} else if (msgitemViews.length > 0) {
					selected = [msgitemViews[0]]
				}
			}
			updateState(oldstate)
		},

		// Remove messages, they can be in different threads.
		removeUIDs: (mailboxID: number, uids: number[]) => {
			const oldstate = state()
			const hadSelected = selected.length > 0
			const threadIDs = new Set<number>()
			uids.forEach(uid => {
				const threadID = removeUID(mailboxID, uid)
				log('removed message with thread', {threadID})
				if (threadID) {
					threadIDs.add(threadID)
				}
			})

			possiblyTakeoutOldThreads(threadIDs)

			if (hadSelected && focus && selected.length === 0) {
				selected = [focus]
			}
			updateState(oldstate)
		},

		// Set new muted/collapsed flags for messages in thread.
		updateMessageThreadFields: (messageIDs: number[], muted: boolean, collapsed: boolean) => {
			for (const id of messageIDs) {
				let miv = msgitemViews.find(miv => miv.messageitem.Message.ID === id)
				if (!miv) {
					miv = collapsedMsgitemViews.find(miv => miv.messageitem.Message.ID === id)
				}
				if (miv) {
					miv.messageitem.Message.ThreadMuted = muted
					miv.messageitem.Message.ThreadCollapsed = collapsed
					const mivthr = miv.threadRoot()
					if (mivthr.collapsed) {
						mivthr.render()
					} else {
						miv.render()
					}
				} else {
					const mi = oldThreadMessageItems.find(mi => mi.Message.ID === id)
					if (mi) {
						mi.Message.ThreadMuted = muted
						mi.Message.ThreadCollapsed = collapsed
					}
				}
			}
		},

		// For location hash.
		activeMessageID: () => selected.length === 1 ? selected[0].messageitem.Message.ID : 0,

		redraw: (miv: MsgitemView) => {
			miv.root.classList.toggle('focus', miv === focus)
			miv.root.classList.toggle('active', selected.indexOf(miv) >= 0)
		},

		clear: (): void => {
			dom._kids(mlv.root)
			msgitemViews.forEach(miv => miv.remove())
			msgitemViews = []
			collapsedMsgitemViews = []
			oldThreadMessageItems = []
			focus = null
			selected = []
			dom._kids(msgElem)
			msgView = null
			setLocationHash()
		},

		unselect: (): void => {
			const oldstate = state()
			selected = []
			updateState(oldstate)
		},

		select: (miv: MsgitemView): void => {
			const oldstate = state()
			focus = miv
			selected = [miv]
			updateState(oldstate)
		},
		selected: () => {
			const l = []
			for (const miv of selected) {
				l.push(miv)
				if (miv.collapsed) {
					l.push(...miv.descendants())
				}
			}
			return l
		},
		openMessage: (parsedMessage: api.ParsedMessage) => {
			let miv = msgitemViews.find(miv => miv.messageitem.Message.ID === parsedMessage.ID)
			if (!miv) {
				// todo: could move focus to the nearest expanded message in this thread, if any?
				return false
			}
			dismissMoveUndoUnless(parsedMessage.ID)
			const oldstate = state()
			focus = miv
			selected = [miv]
			updateState(oldstate, true, parsedMessage)
			return true
		},

		click: (miv: MsgitemView, ctrl: boolean, shift: boolean) => {
			if (msgitemViews.length === 0) {
				return
			}
			if (!(selected.length === 1 && selected[0] === miv)) {
				dismissMoveUndoUnless(miv.messageitem.Message.ID)
			}

			const oldstate = state()
			if (shift) {
				const mivindex = msgitemViews.indexOf(miv)
				// Set selection from start of most recent range.
				let recentindex
				if (selected.length > 0) {
					let o = selected.length-1
					recentindex = msgitemViews.indexOf(selected[o])
					while (o > 0) {
						if (selected[o-1] === msgitemViews[recentindex-1]) {
							recentindex--
						} else if(selected[o-1] === msgitemViews[recentindex+1]) {
							recentindex++
						} else {
							break
						}
						o--
					}
				} else {
					recentindex = mivindex
				}
				const oselected = selected
				if (mivindex < recentindex) {
					selected = msgitemViews.slice(mivindex, recentindex+1)
					selected.reverse()
				} else {
					selected = msgitemViews.slice(recentindex, mivindex+1)
				}
				if (ctrl) {
					selected = oselected.filter(e => !selected.includes(e)).concat(selected)
				}
			} else if (ctrl) {
				const index = selected.indexOf(miv)
				if (index < 0) {
					selected.push(miv)
				} else {
					selected.splice(index, 1)
				}
			} else {
				selected = [miv]
			}
			focus = miv
			updateState(oldstate)
		},

		key: async (k: string, e: KeyboardEvent) => {
			const moveKeys = [
				' ', 'ArrowUp', 'ArrowDown',
				'PageUp', 'h', 'H',
				'PageDown', 'l', 'L',
				'j', 'J',
				'k', 'K',
				'Home', ',', '<',
				'End', '.', '>',
				'n', 'N',
				'p', 'P',
				'u', 'U',
			]
			if (!e.altKey && !e.metaKey && moveKeys.includes(e.key)) {
				const moveclick = (index: number, clip: boolean) => {
					if (clip && index < 0) {
						index = 0
					} else if (clip && index >= msgitemViews.length) {
						index = msgitemViews.length-1
					}
					if (index < 0 || index >= msgitemViews.length) {
						return
					}
					if (e.ctrlKey) {
						moveFocus(msgitemViews[index])
					} else {
						mlv.click(msgitemViews[index], false, e.shiftKey)
					}
				}

				let i = msgitemViews.findIndex(miv => miv === focus)
				if (e.key === ' ') {
					if (i >= 0) {
						mlv.click(msgitemViews[i], e.ctrlKey, e.shiftKey)
					}
				} else if (e.key === 'ArrowUp' || e.key === 'k' || e.key === 'K') {
					moveclick(i-1, e.key === 'K')
				} else if (e.key === 'ArrowDown' || e.key === 'j' || e.key === 'J') {
					moveclick(i+1, e.key === 'J')
				} else if (e.key === 'PageUp' || e.key === 'h' || e.key === 'H' || e.key === 'PageDown' || e.key === 'l' || e.key === 'L') {
					// Commonly bound to "focus to browser address bar", moving cursor to one page down
					// without opening isn't useful enough.
					if (e.key === 'l' && e.ctrlKey) {
						return
					}

					if (msgitemViews.length > 0) {
						let n = Math.max(1, Math.floor(scrollElemHeight()/mlv.itemHeight())-1)
						if (e.key === 'PageUp' || e.key === 'h' || e.key === 'H') {
							n = -n
						}
						moveclick(i + n, true)
					}
				} else if (e.key === 'Home' || e.key === ',' || e.key === '<') {
					moveclick(0, true)
				} else if (e.key === 'End' || e.key === '.' || e.key === '>') {
					moveclick(msgitemViews.length-1, true)
				} else if (e.key === 'n' || e.key === 'N') {
					if (i < 0) {
						moveclick(0, true)
					} else {
						const tid = msgitemViews[i].messageitem.Message.ThreadID
						for (; i < msgitemViews.length; i++) {
							if (msgitemViews[i].messageitem.Message.ThreadID !== tid) {
								moveclick(i, true)
								break
							}
						}
					}
				} else if (e.key === 'p' || e.key === 'P') {
					if (i < 0) {
						moveclick(0, true)
					} else {
						let thrmiv = msgitemViews[i].threadRoot()
						if (thrmiv === msgitemViews[i]) {
							if (i-1 >= 0) {
								thrmiv = msgitemViews[i-1].threadRoot()
							}
						}
						moveclick(msgitemViews.indexOf(thrmiv), true)
					}
				} else if (e.key === 'u' || e.key === 'U') {
					// Commonly bound to "view source", moving cursor to next unread message without
					// opening isn't useful enough.
					if (e.key === 'u' && e.ctrlKey) {
						return
					}

					for (i = i < 0 ? 0 : i+1; i < msgitemViews.length; i += 1) {
						if (!msgitemViews[i].messageitem.Message.Seen || msgitemViews[i].collapsed && msgitemViews[i].findDescendant(miv => !miv.messageitem.Message.Seen)) {
							moveclick(i, true)
							break
						}
					}
				}
				e.preventDefault()
				e.stopPropagation()
				return
			}
			const fn = shortcuts[k]
			if (fn) {
				e.preventDefault()
				e.stopPropagation()
				fn()
			} else if (msgView) {
				msgView.key(k, e)
			} else {
				log('key not handled', k)
			}
		},
		mailboxes: () => listMailboxes(),
		activeMailbox: () => activeMailbox(),
		itemHeight: () => msgitemViews.length > 0 ? msgitemViews[0].root.getBoundingClientRect().height : 25,
		threadExpand: (miv: MsgitemView) => threadExpand(miv, true),
		threadCollapse: (miv: MsgitemView) => threadCollapse(miv, true),
		threadToggle: threadToggle,
		viewportEnsureMessages: viewportEnsureMessages,

		actionBar: listActionBar,
		cmdArchive: cmdArchive,
		cmdTrash: cmdTrash,
		cmdDelete: cmdDelete,
		cmdJunk: cmdJunk,
		cmdMarkNotJunk: cmdMarkNotJunk,
		cmdMarkRead: cmdMarkRead,
		cmdMarkUnread: cmdMarkUnread,
		cmdMute: cmdMute,
		cmdUnmute: cmdUnmute,
	}

	return mlv
}

// MailboxView is a single mailbox item in the list of mailboxes. It is a drag and
// drop target for messages. It can be hidden, when a parent/ancestor is collapsed.
// It can be collapsed itself, causing it to still be visible, but its children
// hidden.
interface MailboxView {
	root: HTMLElement

	// Changed by the MailboxlistView.
	shortname: string // Just the last part of the slash-separated name.
	parents: number // How many parents/ancestors, for indenting.
	hidden: boolean // If currently hidden.

	mailbox: api.Mailbox
	update: () => void // Render again, e.g. after toggling hiddenness.
	open: (load: boolean) => Promise<void> // Open mailbox, clearing MsglistView and, if load is set, requesting messages.
	setCounts: (total:number, unread: number) => void
	setSpecialUse: (specialUse: api.SpecialUse) => void
	setKeywords: (keywords: string[]) => void
}

// Export messages to maildir/mbox in tar/tgz/zip/no container. Either all
// messages, messages in from 1 mailbox, or explicit message ids.
const popoverExport = (reference: HTMLElement, mailboxName: string, messageIDs: number[] | null) => {
	let format: HTMLInputElement
	let archive: HTMLInputElement
	let mboxbtn: HTMLButtonElement
	const removeExport = popover(reference, {},
		dom.h1(ui('Export')),
		dom.form(
			function submit() {
				// If we would remove the popup immediately, the form would be deleted too and never submitted.
				window.setTimeout(() => removeExport(), 100)
			},
			attr.target('_blank'), attr.method('POST'), attr.action('export'),
			dom.input(attr.type('hidden'), attr.name('csrf'), attr.value(localStorageGet('webmailcsrftoken') || '')),
			dom.input(attr.type('hidden'), attr.name('mailbox'), attr.value(mailboxName)),
			dom.input(attr.type('hidden'), attr.name('messageids'), attr.value((messageIDs || []).join(','))),
			format=dom.input(attr.type('hidden'), attr.name('format')),
			archive=dom.input(attr.type('hidden'), attr.name('archive')),

			dom.div(css('exportFields', {display: 'flex', flexDirection: 'column', gap: '.5ex'}),
				mailboxName ? dom.div(dom.label(dom.input(attr.type('checkbox'), attr.name('recursive'), attr.value('on'), function change(e: {target: HTMLInputElement}) { mboxbtn.disabled = e.target.checked }), ui(" Recursive"))) : [],
				dom.div(
					!mailboxName && !messageIDs ? 'Mbox ' : mboxbtn=dom.submitbutton('Mbox', attr.title(ui("Export as mbox file, not wrapped in an archive.")), function click() {
						format.value = 'mbox'
						archive.value = 'none'
					}), ' ',
					dom.submitbutton('zip', function click() {
						format.value = 'mbox'
						archive.value = 'zip'
					}), ' ',
					dom.submitbutton('tgz', function click() {
						format.value = 'mbox'
						archive.value = 'tgz'
					}), ' ',
					dom.submitbutton('tar', function click() {
						format.value = 'mbox'
						archive.value = 'tar'
					}),
				),
				dom.div(
					ui("Maildir "),
					dom.submitbutton('zip', function click() {
						format.value = 'maildir'
						archive.value = 'zip'
					}), ' ',
					dom.submitbutton('tgz', function click() {
						format.value = 'maildir'
						archive.value = 'tgz'
					}), ' ',
					dom.submitbutton('tar', function click() {
						format.value = 'maildir'
						archive.value = 'tar'
					}),
				),
			),
		),
	)
}

// Stroke icons: same attributes as SSClash sidebar SVGs. Path data is Lucide's
// published d (inbox polyline written as a path). Archive's first path is Lucide's
// rect (x=2 y=3 width=20 height=5 rx=1) written as a path.
const strokePaths = {
	inbox: [
		'M22 12 16 12 14 15 10 15 8 12 2 12',
		'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z',
	],
	draft: [
		'M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34',
		'M14 2v5a1 1 0 0 0 1 1h5',
		'M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z',
	],
	sent: [
		'M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z',
		'm21.854 2.147-10.94 10.939',
	],
	trash: [
		'M10 11v6',
		'M14 11v6',
		'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
		'M3 6h18',
		'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
	],
	junk: [
		'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
		'M12 8v4',
		'M12 16h.01',
	],
	archive: [
		'M3 3h18a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z',
		'M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8',
		'M10 12h4',
	],
	folder: [
		'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
	],
	// Hamburger path copied from SSClash sidebar.html.
	menu: ['M4 6h16M4 12h16M4 18h10'],
	compose: [
		'M15.363 17.634a2 2 0 00-.506.854l-.837 2.87a.5.5 0 00.62.62l2.87-.837a2 2 0 00.854-.506l3.013-3.009a1 1 0 10-3.004-3.004z',
		'M22 10.38V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h6.25',
		'm22 7-8.991 5.727a2 2 0 01-2.009 0L2 7',
	],
	// Lucide ellipsis circles (r=1) as stroked paths.
	more: [
		'M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
		'M18 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
		'M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
	],
	back: ['m12 19-7-7 7-7', 'M19 12H5'],
	x: ['M18 6 6 18', 'm6 6 12 12'],
	flag: ['M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5'],
	plus: ['M5 12h14', 'M12 5v14'],
	minus: ['M5 12h14'],
	sun: [
		'M12 2v2',
		'M12 20v2',
		'm4.93 4.93 1.41 1.41',
		'm17.66 17.66 1.41 1.41',
		'M2 12h2',
		'M20 12h2',
		'm6.34 17.66-1.41 1.41',
		'm19.07 4.93-1.41 1.41',
	],
	moon: ['M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401'],
	sunMoon: [
		'M12 2v2',
		'M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715',
		'M16 12a4 4 0 0 0-4-4',
		'm19 5-1.256 1.256',
		'M20 12h2',
	],
	languages: [
		'm5 8 6 6',
		'm4 14 6-6 2-3',
		'M2 5h12',
		'M7 2h1',
		'm22 22-5-10-5 10',
		'M14 18h6',
	],
	chevronDown: ['m6 9 6 6 6-6'],
	circleUser: ['M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662'],
	user: ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2'],
	info: ['M12 16v-4', 'M12 8h.01'],
	bookOpen: ['M12 5v16', 'M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z'],
	settings: ['M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915'],
	logOut: ['m16 17 5-5-5-5', 'M21 12H9', 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4'],
	check: ['M20 6 9 17l-5-5'],
}

const strokeIcon = (paths: string[], circles?: Array<[string, string, string]>, rects?: Array<{x: number, y: number, width: number, height: number, rx: number}>): SVGSVGElement => {
	const ns = 'http://www.w3.org/2000/svg'
	const svg = document.createElementNS(ns, 'svg')
	svg.setAttribute('viewBox', '0 0 24 24')
	svg.setAttribute('fill', 'none')
	svg.setAttribute('stroke', 'currentColor')
	svg.setAttribute('stroke-width', '2')
	svg.setAttribute('stroke-linecap', 'round')
	svg.setAttribute('stroke-linejoin', 'round')
	svg.setAttribute('width', '18')
	svg.setAttribute('height', '18')
	svg.setAttribute('aria-hidden', 'true')
	svg.style.pointerEvents = 'none'
	for (const [cx, cy, r] of circles || []) {
		const circle = document.createElementNS(ns, 'circle')
		circle.setAttribute('cx', cx)
		circle.setAttribute('cy', cy)
		circle.setAttribute('r', r)
		svg.appendChild(circle)
	}
	for (const rect of rects || []) {
		const el = document.createElementNS(ns, 'rect')
		el.setAttribute('x', ''+rect.x)
		el.setAttribute('y', ''+rect.y)
		el.setAttribute('width', ''+rect.width)
		el.setAttribute('height', ''+rect.height)
		el.setAttribute('rx', ''+rect.rx)
		svg.appendChild(el)
	}
	for (const d of paths) {
		const path = document.createElementNS(ns, 'path')
		path.setAttribute('d', d)
		svg.appendChild(path)
	}
	return svg
}

const threadCollapseIcon = (): SVGSVGElement => {
	const icon = strokeIcon(strokePaths.minus)
	icon.setAttribute('width', '14')
	icon.setAttribute('height', '14')
	return icon
}

const flagMarkIcon = (on: boolean): SVGSVGElement => {
	const icon = strokeIcon(strokePaths.flag)
	const cloth = icon.querySelector('path')
	if (on && cloth) {
		cloth.setAttribute('fill', 'currentColor')
		cloth.setAttribute('class', 'msgItemFlagCloth')
	}
	return icon
}

const mailboxStrokeIcon = (mb: api.Mailbox): SVGSVGElement => {
	if (mb.Name.split('/')[0] === 'Inbox') {
		return strokeIcon(strokePaths.inbox)
	}
	if (mb.Draft) {
		return strokeIcon(strokePaths.draft)
	}
	if (mb.Sent) {
		return strokeIcon(strokePaths.sent)
	}
	if (mb.Trash) {
		return strokeIcon(strokePaths.trash)
	}
	if (mb.Junk) {
		return strokeIcon(strokePaths.junk)
	}
	if (mb.Archive) {
		return strokeIcon(strokePaths.archive)
	}
	if (rejectsMailbox !== '' && mb.Name === rejectsMailbox) {
		return icons.rejects()
	}
	if (introboxMailbox !== '' && mb.Name === introboxMailbox) {
		return icons.introbox()
	}
	return strokeIcon(strokePaths.folder)
}

const themeGlyph = (kind: 'sun' | 'moon' | 'auto'): SVGSVGElement => {
	const svg = kind === 'sun' ? strokeIcon(strokePaths.sun, [['12', '12', '4']]) : kind === 'moon' ? strokeIcon(strokePaths.moon) : strokeIcon(strokePaths.sunMoon)
	svg.classList.add('icon')
	return svg
}

const langGlyph = (): SVGSVGElement => {
	const svg = strokeIcon(strokePaths.languages)
	svg.classList.add('icon')
	return svg
}

const layoutGlyph = (id: 'leftright' | 'topbottom' | 'auto'): SVGSVGElement => {
	const frame = {x: 3, y: 3, width: 18, height: 18, rx: 2}
	let rects = [frame]
	let paths: string[]
	if (id === 'leftright') {
		paths = ['M9 3v18']
	} else if (id === 'topbottom') {
		paths = ['M3 9h18']
	} else {
		rects = [{x: 2, y: 4, width: 20, height: 16, rx: 2}]
		paths = ['M12 9v11', 'M2 9h13a2 2 0 0 1 2 2v9']
	}
	const svg = strokeIcon(paths, undefined, rects)
	svg.classList.add('icon')
	return svg
}

const navIcon = (paths: string[], circles?: Array<[string, string, string]>, extra?: string): SVGSVGElement => {
	const svg = strokeIcon(paths, circles)
	svg.classList.add('icon')
	if (extra) svg.classList.add(extra)
	return svg
}

const newMailboxView = (xmb: api.Mailbox, mailboxlistView: MailboxlistView, otherMailbox: otherMailbox): MailboxView => {
	const plusbox = '⊞'
	const minusbox = '⊟'
	const cmdCollapse = async () => {
		settings.mailboxCollapsed[mbv.mailbox.ID] = true
		settingsPut(settings)
		mailboxlistView.updateHidden()
		mbv.root.focus()
	}
	const cmdExpand = async () => {
		delete(settings.mailboxCollapsed[mbv.mailbox.ID])
		settingsPut(settings)
		mailboxlistView.updateHidden()
		mbv.root.focus()
	}
	const collapseElem = dom.span(dom._class('mailboxCollapse'), minusbox, function click(e: MouseEvent) {
		e.stopPropagation()
		cmdCollapse()
	})
	const expandElem = dom.span(plusbox, function click(e: MouseEvent) {
		e.stopPropagation()
		cmdExpand()
	})

	let name: HTMLElement, unread: HTMLElement, mailboxIcon: HTMLElement
	let actionBtn: HTMLButtonElement

	const cmdOpenActions = async () => {
		const trashmb = mailboxlistView.mailboxes().find(mb => mb.Trash)

		const remove = menuPopover(actionBtn, [
			dom.clickbutton(ui("Mark as read"), attr.title(ui("Mark all messages in the mailbox and its sub mailboxes as read.")), async function click() {
				remove()
				const mailboxIDs = [mbv.mailbox.ID, ...mailboxlistView.mailboxes().filter(mb => mb.Name.startsWith(mbv.mailbox.Name+'/')).map(mb => mb.ID)]
				await withStatus(ui("Marking mailboxes as read"), client.MailboxesMarkRead(mailboxIDs))
			}),
			dom.clickbutton(ui("Create mailbox"), attr.title(ui("Create new mailbox within this mailbox.")), function click(e: MouseEvent) {
				let fieldset: HTMLFieldSetElement
				let name: HTMLInputElement
				const ref = e.target! as HTMLElement
				const removeCreate = popover(ref, {},
					dom.form(
						async function submit(e: SubmitEvent) {
							e.preventDefault()
							await withStatus(ui("Creating mailbox"), client.MailboxCreate(mbv.mailbox.Name + '/' + name.value), fieldset)
							removeCreate()
						},
						fieldset=dom.fieldset(
							dom.label(
								ui("Name "),
								name=dom.input(attr.required('yes')),
							),
							' ',
							dom.submitbutton(ui("Create")),
						),
					),
				)
				remove()
				name.focus()
			}),
			dom.clickbutton(ui("Move to trash"), attr.title(ui("Move mailbox, its messages and its mailboxes to the trash.")), async function click() {
				if (!trashmb) {
					window.alert(ui("No mailbox configured for trash yet."))
					return
				}
				if (!window.confirm(ui("Are you sure you want to move this mailbox, its messages and its mailboxes to the trash?"))) {
					return
				}
				remove()
				await withStatus(ui("Moving mailbox to trash"), client.MailboxRename(mbv.mailbox.ID, trashmb.Name + '/' + mbv.mailbox.Name))
			}),
			dom.clickbutton(ui("Delete mailbox"), attr.title(ui("Permanently delete this mailbox and all its messages.")), async function click() {
				if (!window.confirm(ui("Are you sure you want to permanently delete this mailbox and all its messages?"))) {
					return
				}
				remove()
				await withStatus(ui("Deleting mailbox"), client.MailboxDelete(mbv.mailbox.ID))
			}),
			dom.clickbutton(ui("Empty mailbox"), attr.title(ui("Remove all messages from the mailbox, but not mailboxes inside this mailbox or their messages.")), async function click() {
				if (!window.confirm(ui("Are you sure you want to empty this mailbox, permanently removing its messages? Mailboxes inside this mailbox are not affected."))) {
					return
				}
				remove()
				await withStatus(ui("Emptying mailbox"), client.MailboxEmpty(mbv.mailbox.ID))
			}),
			dom.clickbutton(ui("Rename mailbox"), function click() {
				remove()

				let fieldset: HTMLFieldSetElement, name: HTMLInputElement

				const remove2 = popover(actionBtn, {},
					dom.form(
						async function submit(e: SubmitEvent) {
							e.preventDefault()
							await withStatus(ui("Renaming mailbox"), client.MailboxRename(mbv.mailbox.ID, name.value), fieldset)
							remove2()
						},
						fieldset=dom.fieldset(
							dom.label(
								ui("Name "),
								name=dom.input(attr.required(''), attr.value(mbv.mailbox.Name), prop({selectionStart: 0, selectionEnd: mbv.mailbox.Name.length})),
							),
							' ',
							dom.submitbutton(ui("Rename")),
						),
					),
				)
				name.focus()
			}),
			dom.clickbutton(ui("Set role for mailbox..."), attr.title(ui("Set a special-use role on the mailbox, making it the designated mailbox for either Archived, Sent, Draft, Trashed or Junk messages.")), async function click() {
				remove()

				const setUse = async (set: (mb: api.Mailbox) => void) => {
					const mb = {...mbv.mailbox}
					mb.Archive = mb.Draft = mb.Junk = mb.Sent = mb.Trash = false
					set(mb)
					await withStatus(ui("Marking mailbox as special use"), client.MailboxSetSpecialUse(mb))
				}
				menuPopover(actionBtn, [
					dom.clickbutton(ui("Archive"), async function click() { await setUse((mb: api.Mailbox) => { mb.Archive = true }) }),
					dom.clickbutton(ui("Draft"), async function click() { await setUse((mb: api.Mailbox) => { mb.Draft = true }) }),
					dom.clickbutton(ui("Junk"), async function click() { await setUse((mb: api.Mailbox) => { mb.Junk = true }) }),
					dom.clickbutton(ui("Sent"), async function click() { await setUse((mb: api.Mailbox) => { mb.Sent = true }) }),
					dom.clickbutton(ui("Trash"), async function click() { await setUse((mb: api.Mailbox) => { mb.Trash = true }) }),
				])
			}),
			dom.clickbutton(ui("Export as..."), function click() {
				popoverExport(actionBtn, mbv.mailbox.Name, null)
				remove()
			}),
		])
	}

	// Keep track of dragenter/dragleave ourselves, we don't get a neat 1 enter and 1
	// leave event from browsers, we get events for multiple of this elements children.
	let drags = 0

	ensureCSS('.mailboxItem.dropping', {background: styles.highlightBackground}, true)
	ensureCSS('.mailboxItem:hover', {backgroundColor: styles.accentSoft, color: styles.color})
	ensureCSS('.mailboxItem.active', {background: styles.accentSoft, color: styles.accent, fontWeight: '600'})
	ensureCSS('.mailboxHoverOnly', {visibility: 'hidden'})
	ensureCSS('.mailboxItem:hover .mailboxHoverOnly, .mailboxItem:focus .mailboxHoverOnly', {visibility: 'visible'})
	ensureCSS('.mailboxCollapse', {visibility: 'hidden'})
	ensureCSS('.mailboxItem:hover .mailboxCollapse, .mailboxItem:focus .mailboxCollapse', {visibility: 'visible'})

	const root = dom.div(
		dom._class('mailboxItem'),
		attr.tabindex('0'),
		async function keydown(e: KeyboardEvent) {
			if (e.key === 'Enter') {
				e.stopPropagation()
				await withStatus(ui("Opening mailbox"), mbv.open(true))
			} else if (e.key === 'ArrowLeft') {
				e.stopPropagation()
				if (!mailboxlistView.mailboxLeaf(mbv)) {
					cmdCollapse()
				}
			} else if (e.key === 'ArrowRight') {
				e.stopPropagation()
				if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
					cmdExpand()
				}
			} else if (e.key === 'b') {
				cmdOpenActions()
			}
		},
		async function dblclick() {
			if (mailboxlistView.mailboxLeaf(mbv)) {
				return
			}
			if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
				cmdExpand()
			} else {
				cmdCollapse()
			}
		},
		async function click() {
			mbv.root.focus()
			await withStatus(ui("Opening mailbox"), mbv.open(true))
		},
		function dragover(e: DragEvent) {
			e.preventDefault()
			e.dataTransfer!.dropEffect = 'move'
		},
		function dragenter(e: DragEvent) {
			e.stopPropagation()
			drags++
			mbv.root.classList.toggle('dropping', true)
		},
		function dragleave(e: DragEvent) {
			e.stopPropagation()
			drags--
			if (drags <= 0) {
				mbv.root.classList.toggle('dropping', false)
			}
		},
		async function drop(e: DragEvent) {
			e.preventDefault()
			mbv.root.classList.toggle('dropping', false)
			const sentMailboxID = mailboxlistView.mailboxes().find(mb => mb.Sent)?.ID
			const mailboxMsgIDs = JSON.parse(e.dataTransfer!.getData('application/vnd.mox.messages')) as number[][]
			const moved = mailboxMsgIDs
				.filter(mbMsgID => mbMsgID[0] !== xmb.ID)
				.filter(mbMsgID => mailboxMsgIDs.length === 1 || !sentMailboxID || mbMsgID[0] !== sentMailboxID || !otherMailbox(sentMailboxID))
			const msgIDs = moved.map(mbMsgID => mbMsgID[1])
			await withStatus(ui("Moving to ")+mailboxLabel(xmb, xmb.Name), client.MessageMove(msgIDs, xmb.ID, false))
			offerMoveUndo(moved.map(mbMsgID => ({ id: mbMsgID[1], mailboxID: mbMsgID[0] })))
			if (msgIDs.length === 1) {
				const msgID = msgIDs[0]
				const mbSrcID = mailboxMsgIDs.find(mbMsgID => mbMsgID[1] === msgID)![0]
				await moveAskRuleset(msgID, mbSrcID, xmb, mailboxlistView.mailboxes())
			}
		},
		dom.div(
			dom._class('mailbox'),
			mailboxIcon=dom.span(dom._class('mailboxIcon')),
			name=dom.div(dom._class('mailboxName')),
			dom.div(
				dom._class('mailboxActions'),
				actionBtn=dom.clickbutton(dom._class('mailboxHoverOnly'), dom._class('mailboxActionBtn'),
					'…',
					attr.tabindex('-1'), // Without, tab breaks because this disappears when mailbox loses focus.
					attr.arialabel(ui("Mailbox actions")),
					attr.title(ui("Actions on mailbox, like deleting, emptying, renaming.")),
					function click(e: MouseEvent) {
						e.stopPropagation()
						cmdOpenActions()
					},
				),
				unread=dom.span(dom._class('mailboxUnreadBadge', 'isEmpty')),
			),
		),
	)

	const update = () => {
		let moreElems: any[] = []
		if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
			moreElems = [' ', expandElem]
		} else if (!mailboxlistView.mailboxLeaf(mbv)) {
			moreElems = [' ', collapseElem]
		}
		let ntotal = mbv.mailbox.Total
		let nunread = mbv.mailbox.Unread
		if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
			const prefix = mbv.mailbox.Name+'/'
			for (const mb of mailboxlistView.mailboxes()) {
				if (mb.Name.startsWith(prefix)) {
					ntotal += mb.Total
					nunread += mb.Unread
				}
			}
		}
		dom._kids(mailboxIcon, mailboxStrokeIcon(mbv.mailbox))
		mailboxIcon.style.marginLeft = mbv.parents > 0 ? (mbv.parents * 2 / 3) + 'em' : ''
		dom._kids(name, dom.span(mailboxLabel(mbv.mailbox, mbv.shortname), attr.title(ui("Total messages: ") + ntotal), moreElems))
		if (nunread === 0) {
			unread.classList.add('isEmpty')
			unread.removeAttribute('title')
			unread.removeAttribute('aria-label')
			dom._kids(unread, [])
		} else {
			unread.classList.remove('isEmpty')
			const label = nunread > 99 ? '99+' : ''+nunread
			unread.setAttribute('title', unreadTitle(nunread))
			unread.setAttribute('aria-label', unreadTitle(nunread))
			dom._kids(unread, label)
		}
	}

	const mbv = {
		root: root,

		// Set by update(), typically through MailboxlistView updateMailboxNames after inserting.
		shortname: '',
		parents: 0,
		hidden: false,

		update: update,
		mailbox: xmb,
		open: async (load: boolean) => {
			await mailboxlistView.openMailboxView(mbv, load, false)
		},
		setCounts: (total: number, unread: number) => {
			mbv.mailbox.Total = total
			mbv.mailbox.Unread = unread
			// If mailbox is collapsed, parent needs updating.
			// todo optimize: only update parents, not all.
			mailboxlistView.updateCounts()
		},
		setSpecialUse: (specialUse: api.SpecialUse) => {
			mbv.mailbox.Archive = specialUse.Archive
			mbv.mailbox.Draft = specialUse.Draft
			mbv.mailbox.Junk = specialUse.Junk
			mbv.mailbox.Sent = specialUse.Sent
			mbv.mailbox.Trash = specialUse.Trash

			dom._kids(mailboxIcon, mailboxStrokeIcon(mbv.mailbox))
		},
		setKeywords: (keywords: string[]) => {
			mbv.mailbox.Keywords = keywords
		},
	}
	return mbv
}

// MailboxlistView is the list on the left with all mailboxes. It holds MailboxViews.
interface MailboxlistView {
	root: HTMLElement

	loadMailboxes: (mailboxes: api.Mailbox[], mbnameOpt?: string) => void
	closeMailbox: () => void
	openMailboxView: (mbv: MailboxView, load: boolean, focus: boolean) => Promise<void>
	mailboxLeaf: (mbv: MailboxView) => boolean
	updateHidden: () => void

	updateCounts: () => void
	activeMailbox: () => api.Mailbox | null
	mailboxes: () => api.Mailbox[]
	findMailboxByID: (id: number) => api.Mailbox | null
	findMailboxByName: (name: string) => api.Mailbox | null

	openMailboxID: (id: number, focus: boolean) => Promise<void>

	// For change events.
	addMailbox: (mb: api.Mailbox) => void
	renameMailbox: (mailboxID: number, newName: string) => void
	removeMailbox: (mailboxID: number) => void
	setMailboxCounts: (mailboxID: number, total: number, unread: number) => void
	setMailboxSpecialUse: (mailboxID: number, specialUse: api.SpecialUse) => void
	setMailboxKeywords: (mailboxID: number, keywords: string[]) => void
}

const newMailboxlistView = (msglistView: MsglistView, requestNewView: requestNewView, updatePageTitle: updatePageTitle, setLocationHash: setLocationHash, unloadSearch: unloadSearch, otherMailbox: otherMailbox, onOpenMailbox?: () => void): MailboxlistView => {
	let mailboxViews: MailboxView[] = []
	let mailboxViewActive: MailboxView | null

	// Reorder mailboxes and assign new short names and indenting. Called after changing the list.
	const updateMailboxNames = () => {
		const draftmb = mailboxViews.find(mbv => mbv.mailbox.Draft)?.mailbox
		const sentmb = mailboxViews.find(mbv => mbv.mailbox.Sent)?.mailbox
		const archivemb = mailboxViews.find(mbv => mbv.mailbox.Archive)?.mailbox
		const trashmb = mailboxViews.find(mbv => mbv.mailbox.Trash)?.mailbox
		const junkmb = mailboxViews.find(mbv => mbv.mailbox.Junk)?.mailbox
		const stem = (s: string) => s.split('/')[0]
		const special = [
			(mb: api.Mailbox) => stem(mb.Name) === 'Inbox',
			(mb: api.Mailbox) => introboxMailbox !== '' && stem(mb.Name) === stem(introboxMailbox), // not "specialuse"
			(mb: api.Mailbox) => draftmb && stem(mb.Name) === stem(draftmb.Name),
			(mb: api.Mailbox) => sentmb && stem(mb.Name) === stem(sentmb.Name),
			(mb: api.Mailbox) => archivemb && stem(mb.Name) === stem(archivemb.Name),
			(mb: api.Mailbox) => trashmb && stem(mb.Name) === stem(trashmb.Name),
			(mb: api.Mailbox) => junkmb && stem(mb.Name) === stem(junkmb.Name),
		]
		mailboxViews.sort((mbva, mbvb) => {
			const ai = special.findIndex(fn => fn(mbva.mailbox))
			const bi = special.findIndex(fn => fn(mbvb.mailbox))
			if (ai < 0 && bi >= 0) {
				return 1
			} else if (ai >= 0 && bi < 0) {
				return -1
			} else if (ai >= 0 && bi >= 0 && ai !== bi) {
				return ai < bi ? -1 : 1
			}
			const la = mbva.mailbox.Name.split('/')
			const lb = mbvb.mailbox.Name.split('/')
			let n = Math.min(la.length, lb.length)
			for (let i = 0; i < n; i++) {
				if (la[i] === lb[i]) {
					continue
				}
				return la[i] < lb[i] ? -1 : 1
			}
			return mbva.mailbox.Name < mbvb.mailbox.Name ? -1 : 1
		})

		let prevmailboxname: string = ''
		mailboxViews.forEach(mbv => {
			const mb = mbv.mailbox
			let shortname = mb.Name
			let parents = 0
			if (prevmailboxname) {
				let prefix = ''
				for (const s of prevmailboxname.split('/')) {
					const nprefix = prefix + s + '/'
					if (mb.Name.startsWith(nprefix)) {
						prefix = nprefix
						parents++
					} else {
						break
					}
				}
				shortname = mb.Name.substring(prefix.length)
			}
			mbv.shortname = shortname
			mbv.parents = parents
			mbv.update() // Render name.
			prevmailboxname = mb.Name
		})

		updateHidden()
	}

	const mailboxHidden = (mb: api.Mailbox, mailboxesMap: {[key: string]: api.Mailbox}) => {
		let s = ''
		for (const e of mb.Name.split('/')) {
			if (s) {
				s += '/'
			}
			s += e
			const pmb = mailboxesMap[s]
			if (pmb && settings.mailboxCollapsed[pmb.ID] && s !== mb.Name) {
				return true
			}
		}
		return false
	}

	const mailboxLeaf = (mbv: MailboxView) => {
		const index = mailboxViews.findIndex(v => v === mbv)
		const prefix = mbv.mailbox.Name+'/'
		const r = index < 0 || index+1 >= mailboxViews.length || !mailboxViews[index+1].mailbox.Name.startsWith(prefix)
		return r
	}

	const updateHidden = () => {
		const mailboxNameMap: {[key: string]: api.Mailbox} = {}
		mailboxViews.forEach((mbv) => mailboxNameMap[mbv.mailbox.Name] = mbv.mailbox)
		for(const mbv of mailboxViews) {
			mbv.hidden = mailboxHidden(mbv.mailbox, mailboxNameMap)
		}
		mailboxViews.forEach(mbv => mbv.update())
		dom._kids(mailboxesElem, mailboxViews.filter(mbv => !mbv.hidden))
	}

	const root = dom.div()
	const mailboxesElem = dom.div(dom._class('mailboxesList'))

	dom._kids(root,
		dom.div(dom._class('mailboxesRegion'), attr.role('region'), attr.arialabel(ui('Mailboxes')),
			dom.div(
				dom._class('mailboxesHeader'),
				dom.h1(ui('Mailboxes'), css('mailboxesTitle', {fontSize: '.8rem', textTransform: 'uppercase', letterSpacing: '.06em', color: styles.colorMilder, fontWeight: '600', padding: '0 .25em'})),
				dom.clickbutton(dom._class('btnCompact'), dom._class('mailboxActionBtn'),
					'…',
					attr.arialabel(ui("Mailboxes actions")),
					attr.title(ui("Actions on mailboxes like creating a new mailbox or exporting all email.")),
					function click(e: MouseEvent) {
						e.stopPropagation()

						const remove = menuPopover(e.target! as HTMLElement, [
							dom.clickbutton(ui("Create mailbox"), attr.arialabel(ui("Create new mailbox.")), attr.title(ui("Create new mailbox.")), function click(e: MouseEvent) {
								let fieldset: HTMLFieldSetElement
								let name: HTMLInputElement
								const ref = e.target! as HTMLElement
								const removeCreate = popover(ref, {},
									dom.form(
										async function submit(e: SubmitEvent) {
											e.preventDefault()
											await withStatus(ui("Creating mailbox"), client.MailboxCreate(name.value), fieldset)
											removeCreate()
										},
										fieldset=dom.fieldset(
											dom.label(
												ui("Name "),
												name=dom.input(attr.required('yes'), focusPlaceholder('Lists/Go/Nuts')),
											),
											' ',
											dom.submitbutton(ui("Create")),
										),
									),
								)
								remove()
								name.focus()
							}),
							dom.clickbutton(ui("Export as..."), function click(e: MouseEvent) {
								const ref = e.target! as HTMLElement
								popoverExport(ref, '', null)
								remove()
							}),
						])
					},
				),
			),
			mailboxesElem,
		),
	)

	const loadMailboxes = (mailboxes: api.Mailbox[], mbnameOpt?: string) => {
		mailboxViews = mailboxes.map(mb => newMailboxView(mb, mblv, otherMailbox))
		updateMailboxNames()
		if (mbnameOpt) {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.Name === mbnameOpt)
			if (mbv) {
				openMailboxView(mbv, false, false)
			}
		}
	}

	const closeMailbox = () => {
		if (!mailboxViewActive) {
			return
		}
		mailboxViewActive.root.classList.toggle('active', false)
		mailboxViewActive = null
		updatePageTitle()
	}

	const openMailboxView = async (mbv: MailboxView, load: boolean, focus: boolean): Promise<void> => {

		// Ensure searchbarElem is in inactive state.
		unloadSearch()

		if (mailboxViewActive) {
			mailboxViewActive.root.classList.toggle('active', false)
		}

		mailboxViewActive = mbv
		mbv.root.classList.toggle('active', true)

		updatePageTitle()

		if (load) {
			onOpenMailbox?.()
			setLocationHash()
			const f = newFilter()
			f.MailboxID = mbv.mailbox.ID
			await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()))
		} else {
			msglistView.clear()
			setLocationHash()
		}
		if (focus) {
			mbv.root.focus()
		}
	}

	const mblv = {
		root: root,
		loadMailboxes: loadMailboxes,
		closeMailbox: closeMailbox,
		openMailboxView: openMailboxView,
		mailboxLeaf: mailboxLeaf,
		updateHidden: updateHidden,

		updateCounts: (): void => mailboxViews.forEach(mbv => mbv.update()),

		activeMailbox: () => mailboxViewActive ? mailboxViewActive.mailbox : null,
		mailboxes: (): api.Mailbox[] => mailboxViews.map(mbv => mbv.mailbox),
		findMailboxByID: (id: number): api.Mailbox | null => mailboxViews.find(mbv => mbv.mailbox.ID === id)?.mailbox || null,
		findMailboxByName: (name: string): api.Mailbox | null => mailboxViews.find(mbv => mbv.mailbox.Name === name)?.mailbox || null,

		openMailboxID: async (id: number, focus: boolean): Promise<void> => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === id)
			if (mbv) {
				await openMailboxView(mbv, false, focus)
			} else {
				throw new Error(ui("unknown mailbox"))
			}
		},

		addMailbox: (mb: api.Mailbox): void => {
			const mbv = newMailboxView(mb, mblv, otherMailbox)
			mailboxViews.push(mbv)
			updateMailboxNames()
		},

		renameMailbox: (mailboxID: number, newName: string): void => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === mailboxID)
			if (!mbv) {
				throw new Error('rename event: unknown mailbox')
			}
			mbv.mailbox.Name = newName
			updateMailboxNames()
		},

		removeMailbox: (mailboxID: number): void => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === mailboxID)
			if (!mbv) {
				throw new Error('remove event: unknown mailbox')
			}
			if (mbv === mailboxViewActive) {
				const inboxv = mailboxViews.find(mbv => mbv.mailbox.Name === 'Inbox')
				if (inboxv) {
					openMailboxView(inboxv, true, false) // note: async function
				}
			}
			const index = mailboxViews.findIndex(mbv => mbv.mailbox.ID === mailboxID)
			mailboxViews.splice(index, 1)
			updateMailboxNames()
		},

		setMailboxCounts: (mailboxID: number, total: number, unread: number): void => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === mailboxID)
			if (!mbv) {
				throw new Error('mailbox message/unread count changed: unknown mailbox')
			}
			mbv.setCounts(total, unread)
			if (mbv === mailboxViewActive) {
				updatePageTitle()
			}
		},

		setMailboxSpecialUse: (mailboxID: number, specialUse: api.SpecialUse): void => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === mailboxID)
			if (!mbv) {
				throw new Error('special-use flags changed: unknown mailbox')
			}
			mbv.setSpecialUse(specialUse)
			updateMailboxNames()
		},

		setMailboxKeywords: (mailboxID: number, keywords: string[]): void => {
			const mbv = mailboxViews.find(mbv => mbv.mailbox.ID === mailboxID)
			if (!mbv) {
				throw new Error('keywords changed: unknown mailbox')
			}
			mbv.setKeywords(keywords)
		},
	}
	return mblv
}

interface SearchView {
	root: HTMLElement
	submit: () => Promise<void>
	ensureLoaded: () => void // For loading mailboxes into the select dropdown, after SSE connection sent list of mailboxes.
	updateForm: () => void
}

const newSearchView = (searchbarElem: HTMLInputElement, mailboxlistView: MailboxlistView, startSearch: (f: api.Filter, notf: api.NotFilter) => Promise<void>, searchViewClose: () => void) => {
	interface FlagView {
		active: boolean | null
		flag: string
		root: HTMLElement
		update: () => void
	}

	let form: HTMLFormElement
	let words: HTMLInputElement, mailbox: HTMLSelectElement, mailboxkids: HTMLInputElement, from: HTMLInputElement, to: HTMLInputElement, oldestDate: HTMLInputElement, oldestTime: HTMLInputElement, newestDate: HTMLInputElement, newestTime: HTMLInputElement, subject: HTMLInputElement, flagViews: FlagView[], labels: HTMLInputElement, minsize: HTMLInputElement, maxsize: HTMLInputElement
	let attachmentNone: HTMLInputElement, attachmentAny: HTMLInputElement, attachmentImage: HTMLInputElement, attachmentPDF: HTMLInputElement, attachmentArchive: HTMLInputElement, attachmentSpreadsheet: HTMLInputElement, attachmentDocument: HTMLInputElement, attachmentPresentation: HTMLInputElement

	const makeDateTime = (dt: string, tm: string): string => {
		if (!dt && !tm) {
			return ''
		}
		if (!dt) {
			const now = new Date()
			const pad0 = (v: number) => v <= 9 ? '0'+v : ''+v
			dt = [now.getFullYear(), pad0(now.getMonth()+1), pad0(now.getDate())].join('-')
		}
		if (dt && tm) {
			return dt+'T'+tm
		}
		return dt
	}

	const packString = (s: string): string => needsDquote(s) ? dquote(s) : s
	const packNotString = (s: string): string => '-' + (needsDquote(s) || s.startsWith('-') ? dquote(s) : s)

	// Sync the form fields back into the searchbarElem. We process in order of the form,
	// so we may rearrange terms. We also canonicalize quoting and space and remove
	// empty strings.
	const updateSearchbar = (): void => {
		let tokens: Token[] = []
		if (mailbox.value && mailbox.value !== '-1') {
			const v = mailbox.value === '0' ? '' : mailbox.selectedOptions[0].text // '0' is "All mailboxes", represented as "mb:".
			tokens.push([false, 'mb', false, v])
		}
		if (mailboxkids.checked) {
			tokens.push([false, 'submb', false, ''])
		}
		tokens.push(...parseSearchTokens(words.value))
		tokens.push(...parseSearchTokens(from.value).map(t => [t[0], 'f', false, t[3]] as Token))
		tokens.push(...parseSearchTokens(to.value).map(t => [t[0], 't', false, t[3]] as Token))
		const start = makeDateTime(oldestDate.value, oldestTime.value)
		if (start) {
			tokens.push([false, 'start', false, start])
		}
		const end = makeDateTime(newestDate.value, newestTime.value)
		if (end) {
			tokens.push([false, 'end', false, end])
		}
		tokens.push(...parseSearchTokens(subject.value).map(t => [t[0], 's', false, t[3]] as Token))
		const check = (elem: HTMLInputElement, tag: string, value: string): void => {
			if (elem.checked) {
				tokens.push([false, tag, false, value])
			}
		}
		check(attachmentNone, 'a', 'none')
		check(attachmentAny, 'a', 'any')
		check(attachmentImage, 'a', 'image')
		check(attachmentPDF, 'a', 'pdf')
		check(attachmentArchive, 'a', 'archive')
		check(attachmentSpreadsheet, 'a', 'spreadsheet')
		check(attachmentDocument, 'a', 'document')
		check(attachmentPresentation, 'a', 'presentation')

		tokens.push(...flagViews.filter(fv => fv.active !== null).map(fv => {
			return [!fv.active, 'l', false, fv.flag] as Token
		}))
		tokens.push(...parseSearchTokens(labels.value).map(t => [t[0], 'l', t[2], t[3]] as Token))

		tokens.push(...headerViews.filter(hv => hv.key.value).map(hv => [false, 'h', false, hv.key.value+':'+hv.value.value] as Token))
		const minstr = parseSearchSize(minsize.value)[0]
		if (minstr) {
			tokens.push([false, 'minsize', false, minstr])
		}
		const maxstr = parseSearchSize(maxsize.value)[0]
		if (maxstr) {
			tokens.push([false, 'maxsize', false, maxstr])
		}

		searchbarElem.value = tokens.map(packToken).join(' ')
	}

	const setDateTime = (s: string | null | undefined, dateElem: HTMLInputElement, timeElem: HTMLInputElement) => {
		if (!s) {
			return
		}
		const t = s.split('T', 2)
		const dt = t.length === 2 || t[0].includes('-') ? t[0] : ''
		const tm = t.length === 2 ? t[1] : (t[0].includes(':') ? t[0] : '')
		if (dt) {
			dateElem.value = dt
		}
		if (tm) {
			timeElem.value = tm
		}
	}

	// Update form based on searchbarElem. We parse the searchbarElem into a filter. Then reset
	// and populate the form.
	const updateForm = (): void => {
		const [f, notf, strs] = parseSearch(searchbarElem.value, mailboxlistView)
		form.reset()

		const packTwo = (l: string[] | null | undefined, lnot: string[] | null | undefined) => (l || []).map(packString).concat((lnot || []).map(packNotString)).join(' ')

		if (f.MailboxName) {
			const o = [...mailbox.options].find(o => o.text === f.MailboxName) || mailbox.options[0]
			if (o) {
				o.selected = true
			}
		} else if (f.MailboxID === -1) {
			// "All mailboxes except ...".
			mailbox.options[0].selected = true
		} else {
			const id = ''+f.MailboxID
			const o = [...mailbox.options].find(o => o.value === id) || mailbox.options[0]
			o.selected = true
		}
		mailboxkids.checked = f.MailboxChildrenIncluded
		words.value = packTwo(f.Words, notf.Words)
		from.value = packTwo(f.From, notf.From)
		to.value = packTwo(f.To, notf.To)
		setDateTime(strs.Oldest, oldestDate, oldestTime)
		setDateTime(strs.Newest, newestDate, newestTime)
		subject.value = packTwo(f.Subject, notf.Subject)

		const elem = (<{[k: string]: HTMLInputElement}>{
			none: attachmentNone,
			any: attachmentAny,
			image: attachmentImage,
			pdf: attachmentPDF,
			archive: attachmentArchive,
			spreadsheet: attachmentSpreadsheet,
			document: attachmentDocument,
			presentation: attachmentPresentation,
		})[f.Attachments]
		if (elem) {
			attachmentChecks(elem, true)
		}

		const otherlabels: string[] = []
		const othernotlabels: string[] = []
		flagViews.forEach(fv => fv.active = null)
		const setLabels = (flabels: string[] | null | undefined, other: string[], not: boolean) => {
			(flabels || []).forEach(l => {
				l = l.toLowerCase()
				// Find if this is a well-known flag.
				const fv = flagViews.find(fv => fv.flag.toLowerCase() === l)
				if (fv) {
					fv.active = !not
					fv.update()
				} else {
					other.push(l)
				}
			})
		}
		setLabels(f.Labels, otherlabels, false)
		setLabels(notf.Labels, othernotlabels, true)
		labels.value = packTwo(otherlabels, othernotlabels)

		headerViews.slice(1).forEach(hv => hv.root.remove())
		headerViews = [headerViews[0]]
		if (f.Headers && f.Headers.length > 0) {
			(f.Headers || []).forEach((kv, index) => {
				const [k, v] = kv || ['', '']
				if (index > 0) {
					addHeaderView()
				}
				headerViews[index].key.value = k
				headerViews[index].value.value = v
			})
		}

		if (strs.SizeMin) {
			minsize.value = strs.SizeMin
		}
		if (strs.SizeMax) {
			maxsize.value = strs.SizeMax
		}
	}

	const attachmentChecks = (elem: HTMLInputElement, set?: boolean): void => {
		if (elem.checked || set) {
			for (const e of [attachmentNone, attachmentAny, attachmentImage, attachmentPDF, attachmentArchive, attachmentSpreadsheet, attachmentDocument, attachmentPresentation]) {
				if (e !== elem) {
					e.checked = false
				} else if (set) {
					e.checked = true
				}
			}
		}
	}

	const changeHandlers = [
		function change() {
			updateSearchbar()
		},
		function keyup() {
			updateSearchbar()
		},
	]

	const attachmentHandlers = [
		function change(e: Event) {
			attachmentChecks(e.target! as HTMLInputElement)
		},
		function mousedown(e: MouseEvent) {
			// Radiobuttons cannot be deselected normally. With this handler a user can push
			// down on the button, then move pointer out of button and release the button to
			// clear the radiobutton.
			const target = e.target! as HTMLInputElement
			if (e.buttons === 1 && target.checked) {
				target.checked = false
				e.preventDefault()
			}
		},
		...changeHandlers,
	]

	interface HeaderView {
		root: HTMLElement,
		key: HTMLInputElement,
		value: HTMLInputElement,
	}

	let headersCell: HTMLElement // Where we add headerViews.
	let headerViews: HeaderView[]

	const newHeaderView = (first: boolean) => {
		let key: HTMLInputElement, value: HTMLInputElement
		const root = dom.div(
			dom._class('searchHeaderRow'),
			key=dom.input(focusPlaceholder(ui("Header name")), changeHandlers),
			value=dom.input(focusPlaceholder(ui("Header value")), changeHandlers),
			dom.div(dom._class('searchHeaderActions'),
				dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.plus), attr.arialabel(ui("Add row for another header filter.")), attr.title(ui("Add row for another header filter.")), function click() {
					addHeaderView()
				}),
				first ? [] : dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.minus), attr.arialabel(ui("Remove row.")), attr.title(ui("Remove row.")), function click() {
					root.remove()
					const index = headerViews.findIndex(v => v === hv)
					headerViews.splice(index, 1)
					updateSearchbar()
				}),
			),
		)
		const hv: HeaderView = {root: root, key: key, value: value}
		return hv
	}

	const addHeaderView = (): void => {
		const hv = newHeaderView(false)
		headersCell.appendChild(hv.root)
		headerViews.push(hv)
	}

	const setPeriod = (d: Date): void => {
		newestDate.value = ''
		newestTime.value = ''
		const pad0 = (v: number) => v <= 9 ? '0'+v : ''+v
		const dt = [d.getFullYear(), pad0(d.getMonth()+1), pad0(d.getDate())].join('-')
		const tm = ''+pad0(d.getHours())+':'+pad0(d.getMinutes())
		oldestDate.value = dt
		oldestTime.value = tm
		updateSearchbar()
	}

	const searchTableStyle = css('searchTable', {width: '100%', borderCollapse: 'collapse'})

		const root = dom.div(
		dom._class('searchOverlay'),
		function click(e: MouseEvent) {
			e.stopPropagation()
			searchViewClose()
		},
		function keyup(e: KeyboardEvent) {
			if (e.key === 'Escape') {
				e.stopPropagation()
				searchViewClose()
			}
		},
		form=dom.form(
			dom._class('dialogForm'),
			dom._class('dialogPanel'),
			dom._class('searchContent'),
			function click(e: MouseEvent) {
				e.stopPropagation()
			},
			dom.div(dom._class('dialogHeader'),
				dom.h1(ui("Search")),
				dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close search.")), function click() {
					searchViewClose()
				}),
			),
			// This is a separate form, inside the form with the overall search field because
			// when updating the form based on the parsed searchbar, we first need to reset it.
			dom.div(dom._class('dialogBody'),
				dom.table(searchTableStyle,
					dom.tr(
						dom.td(dom.label(ui("Mailbox"), attr.for('searchMailbox')), attr.title(ui("Filter by mailbox, including children of the mailbox."))),
						dom.td(
							mailbox=dom.select(attr.id('searchMailbox'), style({width: '100%'}),
								dom.option(ui("All mailboxes except Trash/Junk/Rejects"), attr.value('-1')),
								dom.option(ui("All mailboxes"), attr.value('0')),
								changeHandlers,
							),
							dom.div(dom._class('searchMailboxKids'), dom.label(mailboxkids=dom.input(attr.type('checkbox'), changeHandlers), ui('Also search in mailboxes below the selected mailbox.'))),
						),
					),
					dom.tr(
						dom.td(dom.label(ui("Text"), attr.for('searchWords'))),
						dom.td(
							words=dom.input(attr.id('searchWords'), attr.title(ui("Filter by text, case-insensitive, substring match, not necessarily whole words.")), focusPlaceholder('word "exact match" -notword'), style({width: '100%'}), changeHandlers),
						),
					),
					dom.tr(
						dom.td(dom.label(ui('From'), attr.for('searchFrom'))),
						dom.td(
							from=dom.input(attr.id('searchFrom'), style({width: '100%'}), focusPlaceholder(ui("Address or name")), newAddressComplete(), changeHandlers)
						),
					),
					dom.tr(
						dom.td(dom.label(ui("To"), attr.for('searchTo')), attr.title(ui("Search on addressee, including Cc and Bcc headers."))),
						dom.td(
							to=dom.input(attr.id('searchTo'), focusPlaceholder(ui("Address or name, also matches Cc and Bcc addresses")), style({width: '100%'}), newAddressComplete(), changeHandlers),
						),
					),
					dom.tr(
						dom.td(dom.label(ui('Subject'), attr.for('searchSubject'))),
						dom.td(
							subject=dom.input(attr.id('searchSubject'), style({width: '100%'}), focusPlaceholder(ui("\"exact match\"")), changeHandlers)
						),
					),
					dom.tr(
						dom.td(ui("Received between"), style({whiteSpace: 'nowrap'})),
						dom.td(
							dom.div(
								dom._class('searchDateRow'),
								oldestDate=dom.input(attr.type('date'), focusPlaceholder('2023-07-20'), changeHandlers),
								oldestTime=dom.input(attr.type('time'), focusPlaceholder('23:10'), changeHandlers),
								dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Clear start date.")), attr.title(ui("Clear start date.")), function click() {
									oldestDate.value = ''
									oldestTime.value = ''
									updateSearchbar()
								}),
								dom.span(ui('and')),
								newestDate=dom.input(attr.type('date'), focusPlaceholder('2023-07-20'), changeHandlers),
								newestTime=dom.input(attr.type('time'), focusPlaceholder('23:10'), changeHandlers),
								dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Clear end date.")), attr.title(ui("Clear end date.")), function click() {
									newestDate.value = ''
									newestTime.value = ''
									updateSearchbar()
								}),
							),
							dom.div(dom._class('searchDatePresets'),
								dom.clickbutton(ui('1 day'), function click() {
									setPeriod(new Date(new Date().getTime() - 24*3600*1000))
								}),
								dom.clickbutton(ui('1 week'), function click() {
									setPeriod(new Date(new Date().getTime() - 7*24*3600*1000))
								}),
								dom.clickbutton(ui('1 month'), function click() {
									setPeriod(new Date(new Date().getTime() - 31*24*3600*1000))
								}),
								dom.clickbutton(ui('1 year'), function click() {
									setPeriod(new Date(new Date().getTime() - 365*24*3600*1000))
								}),
							),
						),
					),
					dom.tr(
						dom.td(ui("Attachments")),
						dom.td(
							dom.div(dom._class('searchRadios'),
								dom.label(attachmentNone=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('none'), attachmentHandlers), ui(" None")),
								dom.label(attachmentAny=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('any'), attachmentHandlers), ui(" Any")),
								dom.label(attachmentImage=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('image'), attachmentHandlers), ui(" Images")),
								dom.label(attachmentPDF=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('pdf'), attachmentHandlers), ui(" PDFs")),
								dom.label(attachmentArchive=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('archive'), attachmentHandlers), ui(" Archives")),
								dom.label(attachmentSpreadsheet=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('spreadsheet'), attachmentHandlers), ui(" Spreadsheets")),
								dom.label(attachmentDocument=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('document'), attachmentHandlers), ui(" Documents")),
								dom.label(attachmentPresentation=dom.input(attr.type('radio'), attr.name('attachments'), attr.value('presentation'), attachmentHandlers), ui(" Presentations")),
							),
						),
					),
					dom.tr(
						dom.td(ui('Labels')),
						dom.td(
							dom.div(dom._class('searchKeywordButtons'),
							join(flagViews=Object.entries({Read: '\\Seen', Replied: '\\Answered', Flagged: '\\Flagged', Deleted: '\\Deleted', Draft: '\\Draft', Forwarded: '$Forwarded', Junk: '$Junk', NotJunk: '$NotJunk', Phishing: '$Phishing', MDNSent: '$MDNSent'}).map(t => {
								const [name, flag] = t
								const v: FlagView = {
									active: null,
									flag: flag,
									root: dom.clickbutton(ui(name), function click() {
										if (v.active === null) {
											v.active = true
										} else if (v.active === true) {
											v.active = false
										} else {
											v.active = null
										}
										v.update()
										updateSearchbar()
									}),
									update: () => {
										css('searchFlagTrue', {backgroundColor: styles.buttonTristateOnBackground}, true)
										css('searchFlagFalse', {backgroundColor: styles.buttonTristateOffBackground}, true)
										v.root.classList.toggle('searchFlagTrue', v.active===true)
										v.root.classList.toggle('searchFlagFalse', v.active===false)
									},
								}
								return v
							}), () => ' '),
							),
							labels=dom.input(focusPlaceholder('todo -done "-dashingname"'), attr.title(ui("User-defined labels.")), changeHandlers),
						),
					),
					dom.tr(
						dom.td(ui('Headers')),
						headersCell=dom.td(headerViews=[newHeaderView(true)]),
					),
					dom.tr(
						dom.td(ui("Size between")),
						dom.td(
							dom.div(dom._class('searchSizeRow'),
								minsize=dom.input(focusPlaceholder('10kb'), changeHandlers),
								dom.span(ui('and')),
								maxsize=dom.input(focusPlaceholder('1mb'), changeHandlers),
							),
						),
					),
				),
			),
			dom.div(dom._class('dialogFooter'),
				dom.clickbutton(ui("Cancel"), function click(e: MouseEvent) {
					e.preventDefault()
					searchViewClose()
				}),
				dom.submitbutton(dom._class('btnPrimary'), ui("Search")),
			),
			async function submit(e: SubmitEvent) {
				e.preventDefault()
				await searchView.submit()
			},
		),
	)

	const submit = async (): Promise<void> => {
		const [f, notf, _] = parseSearch(searchbarElem.value, mailboxlistView)
		await startSearch(f, notf)
	}

	let loaded = false

	const searchView: SearchView = {
		root: root,
		submit: submit,
		ensureLoaded: () => {
			if (loaded || mailboxlistView.mailboxes().length === 0) {
				return
			}
			loaded = true
			dom._kids(mailbox,
				dom.option(ui("All mailboxes except Trash/Junk/Rejects"), attr.value('-1')),
				dom.option(ui("All mailboxes"), attr.value('0')),
				mailboxlistView.mailboxes().map(mb => dom.option(mailboxLabel(mb, mb.Name), attr.value(''+mb.ID))),
			)
			searchView.updateForm()
		},
		updateForm: updateForm,
	}
	return searchView
}

// parse the "mailto:..." part (already decoded) of a "#compose mailto:..." url hash.
const parseComposeMailto = (mailto: string): ComposeOptions => {
	const u = new URL(mailto)

	const addresses = (s: string) => s.split(',').filter(s => !!s)
	const opts: ComposeOptions = {}
	opts.to = addresses(u.pathname).map(s => decodeURIComponent(s))
	for (const [xk, v] of new URLSearchParams(u.search)) {
		const k = xk.toLowerCase()
		if (k === 'to') {
			opts.to = [...opts.to, ...addresses(v)]
		} else if (k === 'cc') {
			opts.cc = [...(opts.cc || []), ...addresses(v)]
		} else if (k === 'bcc') {
			opts.bcc = [...(opts.bcc || []), ...addresses(v)]
		} else if (k === 'subject') {
			// q/b-word encoding is allowed, we let the server decode when we start composing,
			// only if needed. ../rfc/6068:267
			opts.subject = v
		} else if (k === 'body') {
			opts.body = v
		}
		// todo: we ignore other headers for now. we should handle in-reply-to and references at some point. but we don't allow any custom headers at the time of writing.
	}
	return opts
}

// Functions we pass to various views, to access functionality encompassing all views.
type requestNewView = (clearMsgID: boolean, filterOpt?: api.Filter, notFilterOpt?: api.NotFilter) => Promise<void>
type updatePageTitle = () => void
type setLocationHash = () => void
type unloadSearch = () => void
type otherMailbox = (mailboxID: number) => api.Mailbox | null
type possibleLabels = () => string[]
type listMailboxes = () => api.Mailbox[]

const init = async () => {
	let connectionElem: HTMLElement // SSE connection status/error. Empty when connected.
	let accountElem: HTMLAnchorElement
	let loginAddressElem: HTMLElement
	let accountRoot: HTMLElement
	let accountMenu: HTMLElement
	let accountToggle: HTMLButtonElement
	let splitElem: HTMLElement
	let mailboxesElem: HTMLElement
	let currentLayout = ''

	let msglistscrollElem: HTMLElement
	let queryactivityElem: HTMLElement // We show ... when a query is active and data is forthcoming.

	// Elements we make inactive when we are not connected.
	let composeBtn: HTMLButtonElement
	let searchbarElemBox: HTMLElement
	let settingsBtn: HTMLButtonElement
	let mailboxesListMsgBox: HTMLDivElement

	// Shown at the bottom of msglistscrollElem, immediately below the msglistView, when appropriate.
	const listendElem = dom.div(css('msgListEnd', {borderTop: '1px solid', borderColor: styles.borderColor, color: styles.colorMilder, margin: '1ex'}))
	const listloadingElem = dom.div(css('msgListLoading', {textAlign: 'center', padding: '.15em 0', color: styles.colorMild, border: '1px solid', borderColor: styles.borderColor, margin: '1ex', backgroundColor: styles.backgroundColorMild}), ui("loading..."))
	const listerrElem = dom.div(css('msgListErr', {textAlign: 'center', padding: '.15em 0', color: styles.colorMild, border: '1px solid', borderColor: styles.borderColor, margin: '1ex', backgroundColor: styles.backgroundColorMild}))

	let sseID = 0 // Sent by server in initial SSE response. We use it in API calls to make the SSE endpoint return new data we need.
	let viewSequence = 0 // Counter for assigning viewID.
	let viewID = 0 // Updated when a new view is started, e.g. when opening another mailbox or starting a search.
	let search = {
		active: false, // Whether a search is active.
		query: '', // The query, as shown in the searchbar. Used in location hash.
	}
	let requestSequence = 0 // Counter for assigning requestID.
	let requestID = 0 // Current request, server will mirror it in SSE data. If we get data for a different id, we ignore it.
	let requestAnchorMessageID = 0 // For pagination.
	let requestViewEnd = false // If true, there is no more data to fetch, no more page needed for this view.
	let requestFilter = newFilter()
	let requestNotFilter = newNotFilter()
	let requestMsgID = 0 // If > 0, we are still expecting a parsed message for the view, coming from the query. Either we get it and set msgitemViewActive and clear this, or we get to the end of the data and clear it.

	;[moxversion, moxgoos, moxgoarch] = await client.Version()

	const updatePageTitle = () => {
		const mb = mailboxlistView && mailboxlistView.activeMailbox()
		const addr = loginAddress ? loginAddress.User+'@'+formatDomain(loginAddress.Domain) : ''
		if (!mb) {
			document.title = [addr, 'Mox Webmail'].join(' - ')
		} else {
			document.title = ['('+mb.Unread+') '+mailboxLabel(mb, mb.Name), addr, 'Mox Webmail'].join(' - ')
		}
	}

	const faviconLink = document.head.querySelector('link[rel="icon"]') as HTMLLinkElement
	const faviconImg = dom.img(attr.src('favicon.png'))
	const faviconProm = new Promise<void>((resolve, reject) => {
		faviconImg.addEventListener('load', () => resolve())
		faviconImg.addEventListener('error', () => reject())
	})
	let faviconState = 0 // Number of messages, -1 is "no connection". We only redraw when this changes.
	const faviconDraw = async () => {
		try {
			await faviconProm
		} catch (err) {
			return
		}

		let state: number
		if (!eventSource) {
			state = -1
		} else {
			const inbox = mailboxlistView.findMailboxByName('Inbox')
			state = Math.min(999, inbox?.Unread || 0)
		}
		if (faviconState === state) {
			return
		}

		const canvas = dom.canvas(prop({width: faviconImg.naturalWidth, height: faviconImg.naturalHeight}))
		const ctx = canvas.getContext('2d')
		if (!ctx || !faviconLink) {
			return
		}
		ctx.drawImage(faviconImg, 0, 0)
		if (state < 0) {
			// Draw in grayscale indicating disconnected.
			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
			const px = imageData.data
			for (let i = 0; i < px.length; i += 4) {
				const a = px[i+3]
				// Empty pixels stay empty. Forcing alpha here paints a square behind the envelope.
				if (a === 0) {
					continue
				}
				const grey = Math.floor(0.2126 * px[i] + 0.715 * px[i+1] + 0.0722 * px[i+2])
				px[i] = grey
				px[i+1] = grey
				px[i+2] = grey
				px[i+3] = Math.round(a / 2)
			}
			ctx.putImageData(imageData, 0, 0)
		} else if (state > 0) {
			ctx.font = 'bold 14px sans-serif'
			const size = ctx.measureText(''+state)

			ctx.beginPath()
			const radius = (size.fontBoundingBoxAscent + size.fontBoundingBoxDescent)/2
			const slack = radius/3
			const left = Math.min(32 - 2 * radius, 32 - 2*slack - size.width)
			const bottom = 32 // bottom
			const right = 32 // right
			ctx.arc(right-radius, bottom-radius, radius, 1.5*Math.PI, .5*Math.PI, false)
			ctx.lineTo(left-radius, bottom)
			ctx.arc(left+radius, bottom-radius, radius, .5*Math.PI, 1.5*Math.PI, false)
			ctx.lineTo(right+radius, bottom-2*radius)
			ctx.fillStyle = '#222'
			ctx.fill()

			ctx.fillStyle = 'white'
			ctx.fillText(''+state, (right+left)/2 - size.width/2, bottom - size.fontBoundingBoxDescent)
		}
		faviconLink.href = canvas.toDataURL('image/png')
		faviconState = state
	}

	const setLocationHash = () => {
		const msgid = requestMsgID || msglistView.activeMessageID()
		let trail = msgid ? ','+msgid : ''
		if (composeView && composeView.MsgID) {
			trail += ',compose:'+composeView.MsgID
		}
		let hash
		const mb = mailboxlistView && mailboxlistView.activeMailbox()
		if (mb) {
			hash = '#'+mb.Name + trail
		} else if (search.active) {
			hash = '#search ' + search.query + trail
		} else {
			hash = '#'
		}
		// We need to set the full URL or we would get errors about insecure operations for
		// plain http with firefox.
		const l = window.location
		const url = l.protocol + '//' + l.host + l.pathname + l.search + hash
		window.history.replaceState(undefined, '', url)
	}

	const loadSearch = (q: string) => {
		search = {active: true, query: q}
		searchbarElem.value = q
		searchbarElem.classList.toggle('searchbarActive', true) // Cleared when another view is loaded.
		searchbarElemBox.style.flexGrow = '4'
	}
	const unloadSearch = () => {
		searchbarElem.value = ''
		searchbarElem.classList.toggle('searchbarActive', false)
		searchbarElem.style.zIndex = ''
		searchbarElemBox.style.flexGrow = '' // Make search bar smaller again.
		search = {active: false, query: ''}
		searchView.root.remove()
	}
	const clearList = () => {
		msglistView.clear()
		listendElem.remove()
		listloadingElem.remove()
		listerrElem.remove()
	}

	const requestNewView = async (clearMsgID: boolean, filterOpt?: api.Filter, notFilterOpt?: api.NotFilter) => {
		if (!sseID) {
			throw new Error('not connected')
		}

		if (clearMsgID) {
			requestMsgID = 0
		}

		msglistView.root.classList.toggle('loading', true)
		clearList()

		viewSequence++
		viewID = viewSequence
		if (filterOpt) {
			requestFilter = filterOpt
			requestNotFilter = notFilterOpt || newNotFilter()
		}

		requestAnchorMessageID = 0
		requestViewEnd = false
		const bounds = msglistscrollElem.getBoundingClientRect()
		await requestMessages(bounds, requestMsgID)
	}

	const requestMessages = async (scrollBounds: DOMRect, destMessageID: number) => {
		const fetchCount = Math.max(50, 3*Math.ceil(scrollBounds.height/msglistView.itemHeight()))
		const page = {
			AnchorMessageID: requestAnchorMessageID,
			Count: fetchCount,
			DestMessageID: destMessageID,
		}
		requestSequence++
		requestID = requestSequence
		const [f, notf] = refineFilters(requestFilter, requestNotFilter)
		const query = {
			OrderAsc: settings.orderAsc,
			Threading: settings.threading,
			Filter: f,
			NotFilter: notf,
		}
		const request = {
			ID: requestID,
			SSEID: sseID,
			ViewID: viewID,
			Cancel: false,
			Query: query,
			Page: page,
		}
		dom._kids(queryactivityElem, ui("loading..."))
		msglistscrollElem.appendChild(listloadingElem)
		await client.Request(request)
	}

	// msgElem can show a message, show actions on multiple messages, or be empty.
	let msgElem = dom.div(
		css('msgElem', {position: 'absolute', right: 0, left: 0, top: 0, bottom: 0, backgroundColor: styles.backgroundColorMild, borderLeft: '1px solid', borderLeftColor: styles.borderColor}),
	)

	let mobileMsgTitle!: HTMLElement
	let topBarMessageTitle!: HTMLElement
	const applyMobileLayoutStyles = () => {
		if (!splitElem) {
			return
		}
		const layoutTop = splitElem.querySelector('.layoutTop') as HTMLElement | null
		const layoutBottom = splitElem.querySelector('.layoutBottom') as HTMLElement | null
		const layoutLeft = splitElem.querySelector('.layoutLeft') as HTMLElement | null
		const layoutRight = splitElem.querySelector('.layoutRight') as HTMLElement | null
		const grabTB = splitElem.querySelector('.listMsgTopBottomGrab') as HTMLElement | null
		const grabLR = splitElem.querySelector('.listMsgLeftRightGrab') as HTMLElement | null
		if (isMobile()) {
			splitElem.style.left = '0'
			splitElem.style.right = '0'
			if (mailboxesElem) {
				mailboxesElem.style.width = ''
			}
			for (const pane of [layoutTop, layoutBottom, layoutLeft, layoutRight]) {
				if (!pane) {
					continue
				}
				pane.style.top = '0'
				pane.style.bottom = '0'
				pane.style.left = '0'
				pane.style.right = '0'
				pane.style.width = 'auto'
				pane.style.height = 'auto'
			}
			if (grabTB) {
				grabTB.style.display = 'none'
			}
			if (grabLR) {
				grabLR.style.display = 'none'
			}
		} else {
			applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth))
			splitElem.style.right = '0'
			if (currentLayout === 'topbottom') {
				if (layoutTop) {
					layoutTop.style.top = '0'
					layoutTop.style.left = '0'
					layoutTop.style.right = '0'
					layoutTop.style.bottom = ''
					layoutTop.style.width = 'auto'
					layoutTop.style.height = 'calc('+settings.topHeightPct+'% - 1px)'
				}
				if (layoutBottom) {
					layoutBottom.style.bottom = '0'
					layoutBottom.style.left = '0'
					layoutBottom.style.right = '0'
					layoutBottom.style.width = 'auto'
					layoutBottom.style.height = 'auto'
					layoutBottom.style.top = 'calc('+settings.topHeightPct+'% + 1px)'
				}
				if (grabTB) {
					grabTB.style.display = ''
				}
			} else if (currentLayout === 'leftright') {
				if (layoutLeft) {
					layoutLeft.style.top = '0'
					layoutLeft.style.bottom = '0'
					layoutLeft.style.left = '0'
					layoutLeft.style.height = 'auto'
					layoutLeft.style.width = 'calc('+settings.leftWidthPct+'% - 1px)'
				}
				if (layoutRight) {
					layoutRight.style.top = '0'
					layoutRight.style.bottom = '0'
					layoutRight.style.right = '0'
					layoutRight.style.height = 'auto'
					layoutRight.style.left = 'calc('+settings.leftWidthPct+'% + 1px)'
				}
				if (grabLR) {
					grabLR.style.display = ''
				}
			}
		}
	}
	const setMobilePane = (pane: 'list' | 'message') => {
		document.documentElement.classList.toggle('mobile-pane-list', isMobile() && pane === 'list')
		document.documentElement.classList.toggle('mobile-pane-message', isMobile() && pane === 'message')
		applyMobileLayoutStyles()
	}
	const closeMailboxesDrawer = () => {
		document.documentElement.classList.remove('mailboxes-drawer-open')
	}
	const openMailboxesDrawer = () => {
		document.documentElement.classList.add('mailboxes-drawer-open')
	}
	const onMobileMailboxOpen = () => {
		if (!isMobile()) {
			return
		}
		closeMailboxesDrawer()
		msglistView.unselect()
		setMobilePane('list')
	}
	const onMobileMessagePane = (open: boolean) => {
		if (!isMobile()) {
			return
		}
		setMobilePane(open ? 'message' : 'list')
		if (open) {
			const mb = mailboxlistView.activeMailbox()
			const subj = msglistView.activeMessageID() ? (msglistView.selected()[0]?.messageitem.Envelope.Subject || ui('(no subject)')) : ''
			const title = subj || (mb ? mailboxLabel(mb, mb.Name) : ui('Message'))
			mobileMsgTitle.textContent = title
		}
	}
	const mobileBackToList = () => {
		msglistView.unselect()
		setMobilePane('list')
	}

	// Returns possible labels based, either from active mailbox (possibly from search), or all mailboxes.
	const possibleLabels = (): string[] => {
		if (requestFilter.MailboxID > 0) {
			const mb = mailboxlistView.findMailboxByID(requestFilter.MailboxID)
			if (mb) {
				return mb.Keywords || []
			}
		}
		const all: {[key: string]: undefined} = {}
		mailboxlistView.mailboxes().forEach(mb => {
			for (const k of (mb.Keywords || [])) {
				all[k] = undefined
			}
		})
		const l = Object.keys(all)
		l.sort()
		return l
	}

	const refineKeyword = async (kw: string) => {
		settingsPut({...settings, refine: 'label:'+kw})
		refineToggleActive(refineLabelBtn as HTMLButtonElement)
		dom._kids(refineLabelBtn, ui('Label: ')+kw)
		await withStatus(ui("Requesting messages"), requestNewView(false))
	}

	const viewportEnsureMessages = async () => {
		// We know how many entries we have, and how many screenfulls. So we know when we
		// only have 2 screen fulls left. That's when we request the next data.
		const bounds = msglistscrollElem.getBoundingClientRect()
		if (msglistscrollElem.scrollTop < msglistscrollElem.scrollHeight-3*bounds.height) {
			return
		}

		// log('new request for scroll')
		await withStatus(ui('Requesting more messages'), requestMessages(bounds, 0))
	}

	const otherMailbox = (mailboxID: number): api.Mailbox | null => requestFilter.MailboxID !== mailboxID ? (mailboxlistView.findMailboxByID(mailboxID) || null) : null
	const listMailboxes = () => mailboxlistView.mailboxes()
	const activeMailbox = () => mailboxlistView.activeMailbox()
	const msglistView = newMsglistView(msgElem, activeMailbox, listMailboxes, setLocationHash, otherMailbox, possibleLabels, () => msglistscrollElem ? msglistscrollElem.getBoundingClientRect().height : 0, refineKeyword, viewportEnsureMessages, onMobileMessagePane)
	const mailboxlistView = newMailboxlistView(msglistView, requestNewView, updatePageTitle, setLocationHash, unloadSearch, otherMailbox, onMobileMailboxOpen)

	let refineUnreadBtn: HTMLButtonElement, refineReadBtn: HTMLButtonElement, refineAttachmentsBtn: HTMLButtonElement, refineFlaggedBtn: HTMLButtonElement, refineLabelBtn: HTMLButtonElement
	const refineToggleActive = (btn: HTMLButtonElement | null): void => {
		for (const e of [refineUnreadBtn, refineReadBtn, refineAttachmentsBtn, refineFlaggedBtn, refineLabelBtn]) {
			e.classList.toggle('active', e === btn)
		}
		if (btn !== null && btn !== refineLabelBtn) {
			dom._kids(refineLabelBtn, ui("Label"))
		}
	}

	const refineToggle = async (refine: string, btn: HTMLButtonElement) => {
		if (settings.refine === refine) {
			settingsPut({...settings, refine: ''})
			refineToggleActive(null)
		} else {
			settingsPut({...settings, refine: refine})
			refineToggleActive(btn)
		}
		dom._kids(refineLabelBtn, settings.refine.startsWith('label:') ? ui('Label: ')+settings.refine.substring('label:'.length) : ui('Label'))
		await withStatus(ui("Requesting messages"), requestNewView(false))
	}

	let threadMode: HTMLSelectElement

	const msgColumnDraggerStyle = css('msgColumnDragger', {position: 'absolute', top: 0, bottom: 0, width: '1px', backgroundColor: styles.popupBorderColor, left: '2.5px'})

	let msglistElem = dom.div(css('msgList', {backgroundColor: styles.msglistBackgroundColor, position: 'absolute', left: '0', right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column'}),
		dom.div(
			attr.role('region'), attr.arialabel(ui('Filter and sorting buttons for message list')),
			css('msgListFilterSorting', {display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap', gap: '6px', minWidth: 0, backgroundColor: styles.backgroundColorMild, borderBottom: '1px solid', borderBottomColor: styles.borderColor, padding: '.35em .5em'}),
			dom.div(
				dom._class('refineBar'),
				dom.span(css('refineTitle', {fontWeight: 'normal', fontSize: 'inherit'}), ui("Refine:"), attr.title(ui("Refine message listing with quick filters. These refinement filters are in addition to any search criteria, but the refine attachment filter overrides a search attachment criteria."))),
				dom.span(dom._class('btngroup'),
					refineUnreadBtn=dom.clickbutton(settings.refine === 'unread' ? dom._class('active') : [],
						ui('Unread'),
						attr.title(ui("Only show messages marked as unread.")),
						async function click(e: MouseEvent) {
							await refineToggle('unread', e.target! as HTMLButtonElement)
						},
					),
					refineReadBtn=dom.clickbutton(settings.refine === 'read' ? dom._class('active') : [],
						ui('Read'),
						attr.title(ui("Only show messages marked as read.")),
						async function click(e: MouseEvent) {
							await refineToggle('read', e.target! as HTMLButtonElement)
						},
					),
					refineAttachmentsBtn=dom.clickbutton(settings.refine === 'attachments' ? dom._class('active') : [],
						ui("Attachments"),
						attr.title(ui("Only show messages with attachments.")),
						async function click(e: MouseEvent) {
							await refineToggle('attachments', e.target! as HTMLButtonElement)
						},
					),
					refineFlaggedBtn=dom.clickbutton(settings.refine === 'flagged' ? dom._class('active') : [],
						ui("Flagged"),
						attr.title(ui("Only show flagged/starred messages.")),
						async function click(e: MouseEvent) {
							await refineToggle('flagged', e.target! as HTMLButtonElement)
						},
					),
					refineLabelBtn=dom.clickbutton(settings.refine.startsWith('label:') ? [dom._class('active'), ui('Label: ')+settings.refine.substring('label:'.length)] : ui('Label'),
						attr.title(ui('Only show messages with the selected label.')),
						async function click(e: MouseEvent) {
							const labels = possibleLabels()
							const remove = menuPopover(e.target! as HTMLElement, [
								...labels.map(l => {
									const selectLabel = async () => {
										await refineToggle('label:'+l, e.target! as HTMLButtonElement)
										remove()
									}
									return dom.clickbutton(styleClasses.keyword, keywordButtonStyle, l, async function click() {
										await selectLabel()
									})
								}),
								labels.length === 0 ? dom.clickbutton(ui("No labels yet"), attr.disabled('')) : [],
							])
						},
					),
					dom.clickbutton(
						'×',
						attr.arialabel(ui("Clear refinement filters.")),
						attr.title(ui("Clear refinement filters.")),
						async function click(e: MouseEvent) {
							settingsPut({...settings, refine: ''})
							refineToggleActive(e.target! as HTMLButtonElement)
							await withStatus(ui("Requesting messages"), requestNewView(false))
						},
					),
				),
				dom.div(
					dom._class('msgListFilterSortingControls'),
					queryactivityElem=dom.span(),
					dom.span(dom._class('threadModeLabel'), ui('Threads')),
					threadMode=dom.select(
						dom._class('threadModeSelect'),
						attr.arialabel(ui("Thread modes.")),
						attr.title(ui("Off: Threading disabled, messages are shown individually.\nOn: Group messages in threads, expanded by default except when (previously) manually collapsed.\nUnread: Only expand thread with unread messages, ignoring and not saving whether they were manually collapsed.")),
						dom.option(ui("Threads: Off"), attr.value(api.ThreadMode.ThreadOff), settings.threading === api.ThreadMode.ThreadOff ? attr.selected('') : []),
						dom.option(ui("Threads: On"), attr.value(api.ThreadMode.ThreadOn), settings.threading === api.ThreadMode.ThreadOn ? attr.selected('') : []),
						dom.option(ui("Threads: Unread"), attr.value(api.ThreadMode.ThreadUnread), settings.threading === api.ThreadMode.ThreadUnread ? attr.selected('') : []),
						async function change() {
							let reset = settings.threading === api.ThreadMode.ThreadOff
							settingsPut({...settings, threading: threadMode.value as api.ThreadMode})
							reset = reset || settings.threading === api.ThreadMode.ThreadOff
							if (reset) {
								await withStatus(ui("Requesting messages"), requestNewView(false))
							} else {
								msglistView.threadToggle()
							}
						},
					),
					dom.clickbutton(dom._class('threadSortBtn'), '↑↓', attr.title(ui("Toggle sorting by date received.")), settings.orderAsc ? dom._class('invert') : [], async function click(e: MouseEvent) {
						settingsPut({...settings, orderAsc: !settings.orderAsc})
						;(e.target! as HTMLButtonElement).classList.toggle('invert', settings.orderAsc)
						// We don't want to include the currently selected message because it could cause a
						// huge amount of messages to be fetched. e.g. when first message in large mailbox
						// was selected, it would now be the last message.
						await withStatus(ui("Requesting messages"), requestNewView(true))
					}),
				),
			),
		),
		msglistView.actionBar,
		dom.div(
			style({height: '1ex', position: 'relative'}),
			dom.div(dom._class('msgItemFlags')),
			dom.div(dom._class('msgItemFlagsOffset'), css('msgItemFlagsGrab', {position: 'absolute', width: '6px', top: 0, bottom: 0, marginLeft: '-3px', cursor: 'ew-resize'}),
				dom.div(msgColumnDraggerStyle),
				function mousedown(e: MouseEvent) {
					startDrag(e, (e) => {
						const bounds = msglistscrollElem.getBoundingClientRect()
						const width = Math.round(e.clientX - bounds.x)
						settingsPut({...settings, msglistflagsWidth: width})
						updateMsglistWidths()
					})
				}
			),
			dom.div(dom._class('msgItemMain')),
			dom.div(dom._class('msgItemMainOffset'), css('msgItemFlagsGrab', {position: 'absolute', width: '6px', top: 0, bottom: 0, marginLeft: '-3px', cursor: 'ew-resize'}),
				dom.div(msgColumnDraggerStyle),
				function mousedown(e: MouseEvent) {
					startDrag(e, (e) => {
						const bounds = msglistscrollElem.getBoundingClientRect()
						const width = Math.round(bounds.x+bounds.width - e.clientX)
						settingsPut({...settings, msglistageWidth: width})
						updateMsglistWidths()
					})
				}
			),
			dom.div(dom._class('msgItemAge')),
		),
		dom.div(
			style({flexGrow: '1', position: 'relative'}),
			msglistscrollElem=dom.div(yscrollStyle,
				attr.role('region'), attr.arialabel(ui("Message list")),
				async function scroll() {
					if (!sseID || requestViewEnd || requestID) {
						return
					}

					await viewportEnsureMessages()
				},
				dom.div(
					style({width: '100%', borderSpacing: '0'}),
					msglistView,
				),
			),
		),
	)
	moveUndoHost = msglistElem

	let searchbarElem: HTMLInputElement // Input field for search

	// Called by searchView when user executes the search.
	const startSearch = async (f: api.Filter, notf: api.NotFilter): Promise<void> => {
		if (!sseID) {
			window.alert(ui('Error: ') + ui('Not connected'))
			return
		}

		// If search has an attachment filter, clear it from the quick filter or we will
		// confuse the user with no matches. The refinement would override the selection.
		if (f.Attachments !== '' && settings.refine === 'attachments') {
			settingsPut({...settings, refine: ''})
			refineToggleActive(null)
		}
		search = {active: true, query: searchbarElem.value}
		mailboxlistView.closeMailbox()
		setLocationHash()
		searchbarElem.classList.toggle('searchbarActive', true) // Cleared when another view is loaded.
		searchView.root.remove()
		searchbarElem.blur()
		document.body.focus()
		await withStatus(ui("Requesting messages"), requestNewView(true, f, notf))
	}

	// Called by searchView when it is closed, due to escape key or click on background.
	const searchViewClose = () => {
		if (!search.active) {
			unloadSearch()
		} else {
			searchbarElem.value = search.query
			searchView.root.remove()
		}
	}

	// For dragging.
	let topcomposeboxElem: HTMLElement, mailboxessplitElem: HTMLElement

	const searchbarInitial = () => {
		const mailboxActive = mailboxlistView.activeMailbox()
		if (mailboxActive && mailboxActive.Name !== 'Inbox') {
			return packToken([false, 'mb', false, mailboxActive.Name]) + ' '
		}
		return ''
	}

	const positionSearchView = () => {
		const content = searchView.root.querySelector('.searchContent') as HTMLElement | null
		if (!content) {
			return
		}
		content.style.top = ''
		content.style.left = ''
		content.style.right = ''
		content.style.width = ''
		content.style.transform = ''
	}

	const ensureSearchView = () => {
		if (searchView.root.parentElement) {
			positionSearchView()
			return
		}
		clearMoveUndo()
		searchView.ensureLoaded()
		page.appendChild(searchView.root)
		positionSearchView()

		// Make search bar as wide as possible. Made smaller when searchView is hidden again.
		searchbarElemBox.style.flexGrow = '4'

		searchbarElem.style.zIndex = zindexes.searchbar
	}

	const cmdSearch = async () => {
		searchbarElem.focus()
		if (!searchbarElem.value) {
			searchbarElem.value = searchbarInitial()
		}
		ensureSearchView()
		searchView.updateForm()
	}

	const cmdCompose = async () => {
		let body = ''
		let sig = accountSettings?.Signature || ''
		if (sig) {
			body += '\n\n' + sig
		}
		compose({body: body, editOffset: 0}, listMailboxes, setLocationHash)
	}
	const cmdOpenInbox = async () => {
		const mb = mailboxlistView.findMailboxByName('Inbox')
		if (mb) {
			await mailboxlistView.openMailboxID(mb.ID, true)
			const f = newFilter()
			f.MailboxID = mb.ID
			await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()))
		}
	}
	const cmdFocusMsg = async() => {
		const btn = msgElem.querySelector('button')
		if (btn && btn instanceof HTMLElement) {
			btn.focus()
		}
	}

	const shortcuts: {[key: string]: command} = {
		i: cmdOpenInbox,
		'/': cmdSearch,
		'?': cmdHelp,
		'ctrl ?': cmdTooltip,
		c: cmdCompose,
		'ctrl m': cmdFocusMsg,
		'ctrl !': cmdSettings,
	}

	// One closer owns both document listeners. A leftover listener would close the next open.
	let closeAccountMenu = () => {}
	const openAccountMenu = () => {
		if (accountRoot.classList.contains('open')) {
			return
		}
		accountRoot.classList.add('open')
		accountToggle.setAttribute('aria-expanded', 'true')
		const onDocClick = (ev: MouseEvent) => {
			const t = ev.target
			if (t instanceof Node && accountRoot.contains(t)) {
				return
			}
			closeAccountMenu()
		}
		const onDocKey = (ev: KeyboardEvent) => {
			if (ev.key === 'Escape') {
				closeAccountMenu()
			}
		}
		document.addEventListener('click', onDocClick)
		document.addEventListener('keydown', onDocKey)
		closeAccountMenu = () => {
			accountRoot.classList.remove('open')
			accountToggle.setAttribute('aria-expanded', 'false')
			document.removeEventListener('click', onDocClick)
			document.removeEventListener('keydown', onDocKey)
			closeAccountMenu = () => {}
		}
	}
	const accountCmdItem = (icon: SVGSVGElement, label: string, title: string, cmd: command) => {
		return dom.clickbutton(
			dom._class('nav-account-item'),
			attr.role('menuitem'),
			icon,
			label,
			attr.title(title),
			async function click() {
				closeAccountMenu()
				await shortcutCmd(cmd, shortcuts)
			},
		)
	}

	const topBarStyle = css('topBar', {backgroundColor: styles.mailboxesTopBackgroundColor})
	const mailboxesSidebarStyle = css('mailboxesSidebar', {backgroundColor: styles.mailboxesSidebarBackground, borderRight: '1px solid', borderRightColor: styles.borderColor})
	// class searchbarActive toggled on searchbarElem; colors via .topBarSearchInput.searchbarActive.

	let msgPaneWrap: HTMLElement

	const showMobileOverflow = (ref: HTMLElement) => {
		menuPopover(ref, [
			dom.clickbutton(ui("Tooltip"), clickCmd(cmdTooltip, shortcuts)),
			dom.clickbutton(ui("Help"), clickCmd(cmdHelp, shortcuts)),
			dom.clickbutton(ui("Settings"), clickCmd(cmdSettings, shortcuts)),
			dom.clickbutton(ui("Logout"), async function click(ev: MouseEvent) {
				await withStatus(ui("Logging out"), client.Logout(), ev.target! as HTMLButtonElement)
				localStorageRemove('webmailcsrftoken')
				if (eventSource) {
					eventSource.close()
					eventSource = null
				}
				window.location.reload()
			}),
		])
	}

	let fitMailboxWidth: (want: number) => number = (want) => want
	let applyMailboxColumnWidth: (px: number) => void = () => {}

	const layoutModes = [
		{id: 'leftright', label: () => ui('Left/right'), icon: () => layoutGlyph('leftright')},
		{id: 'topbottom', label: () => ui('Top/bottom'), icon: () => layoutGlyph('topbottom')},
		{id: 'auto', label: () => ui('Auto layout'), icon: () => layoutGlyph('auto')},
	] as const
	const layoutButtons: HTMLButtonElement[] = []
	const syncLayoutButtons = () => {
		for (let i = 0; i < layoutModes.length; i++) {
			const on = settings.layout === layoutModes[i].id
			layoutButtons[i].classList.toggle('isOn', on)
			layoutButtons[i].setAttribute('aria-pressed', on ? 'true' : 'false')
		}
	}
	let applyLayoutMode: (id: typeof layoutModes[number]['id']) => void = () => {}
	const layoutRow = dom.div(
		dom._class('nav-account-layouts'),
		attr.arialabel(ui('Layout')),
		...layoutModes.map(mode => {
			const on = settings.layout === mode.id
			const btn = dom.clickbutton(
				on ? dom._class('nav-layout', 'isOn') : dom._class('nav-layout'),
				mode.icon(),
				attr.title(mode.label()),
				attr.arialabel(mode.label()),
				dom._attrs({'aria-pressed': on ? 'true' : 'false'}),
				function click() {
					applyLayoutMode(mode.id)
				},
			)
			layoutButtons.push(btn)
			return btn
		}),
	)

	const webmailroot = dom.div(
		css('webmailRoot', {display: 'flex', flexDirection: 'column', alignContent: 'stretch', height: '100dvh', position: 'relative', zIndex: 0}),
		dom.div(topBarStyle,
			attr.role('region'), attr.arialabel(ui("Top bar")),
			topcomposeboxElem=dom.div(dom._class('pad'), dom._class('topBarComposeDesktop'),
				style({width: settings.mailboxesWidth + 'px', textAlign: 'center'}),
				composeBtn=dom.clickbutton(dom._class('btnPrimary'), strokeIcon(strokePaths.compose), ui("Compose"), attr.title(ui("Compose new email message.")), function click() {
					shortcutCmd(cmdCompose, shortcuts)
				}),
			),
			dom.div(dom._class('pad'), dom._class('topBarSearchRow'),
				dom.div(dom._class('topBarMobileOnly'),
					dom.clickbutton(dom._class('topBarMenuBtn'), attr.title(ui("Open mailboxes.")), attr.arialabel(ui("Open mailboxes.")), function click() {
						openMailboxesDrawer()
					},
						dom.span(dom._class('topBarMenuIcon'),
							strokeIcon(strokePaths.menu),
						),
					),
				),
				dom.div(css('searchbarBox', {paddingLeft: 0, display: 'flex', flexGrow: 1, minWidth: 0}),
					searchbarElemBox=dom.search(
					style({display: 'flex', flex: 1, minWidth: 0, width: '100%'}),
					dom.form(
						dom._class('topBarSearchForm'),
						searchbarElem=dom.input(
							dom._class('topBarSearchInput'),
							attr.placeholder(ui("Search...")),
							style({position: 'relative'}),
							attr.title(ui("Search messages based on criteria like matching free-form text, in a mailbox, labels, addressees.")),
							focusPlaceholder('word "with space" -notword mb:Inbox f:from@x.example t:rcpt@x.example start:2023-7-1 end:2023-7-8 s:"subject" a:images l:$Forwarded h:Reply-To:other@x.example minsize:500kb'),
							function click() {
								cmdSearch()
								showShortcut('/')
							},
							function focus() {
								// Make search bar as wide as possible. Made smaller when searchView is hidden again.
								searchbarElemBox.style.flexGrow = '4'
								if (!searchbarElem.value) {
									searchbarElem.value = searchbarInitial()
								}
							},
							function blur() {
								if (searchbarElem.value === searchbarInitial()) {
									searchbarElem.value = ''
								}
								if (!search.active) {
									searchbarElemBox.style.flexGrow = ''
								}
							},
							function change() {
								searchView.updateForm()
							},
							function keyup(e: KeyboardEvent) {
								if (e.key === 'Escape') {
									e.stopPropagation()
									searchViewClose()
									return
								}
								if (searchbarElem.value && searchbarElem.value !== searchbarInitial()) {
									ensureSearchView()
								}
								searchView.updateForm()
							},
						),
						dom.clickbutton(dom._class('topBarSearchClear'),
							strokeIcon(strokePaths.x),
							attr.arialabel(ui("Cancel and clear search and open Inbox.")),
							attr.title(ui("Cancel and clear search and open Inbox.")),
							async function click() {
								searchbarElem.value = ''
								if (!search.active) {
									return
								}

								const mb = mailboxlistView.findMailboxByName('Inbox')
								if (!mb) {
									window.alert(ui("Cannot find inbox."))
									return
								}
								await mailboxlistView.openMailboxID(mb.ID, true)
								const f = newFilter()
								f.MailboxID = mb.ID
								await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()))
							},
						),
						async function submit(e: SubmitEvent) {
							e.preventDefault()
							await searchView.submit()
						},
					),
					),
				),
				dom.div(dom._class('topBarMobileOnly'),
					dom.clickbutton(dom._class('btnPrimary'), dom._class('topBarMobileCompose'), strokeIcon(strokePaths.compose), attr.title(ui("Compose new email message.")), attr.arialabel(ui("Compose")), function click() {
						shortcutCmd(cmdCompose, shortcuts)
					}),
				),
				dom.div(dom._class('topBarMobileOnly'),
					dom.clickbutton(dom._class('topBarMobileOverflow'), strokeIcon(strokePaths.more), attr.title(ui("More actions.")), attr.arialabel(ui("More actions")), function click(e: MouseEvent) {
						showMobileOverflow(e.target! as HTMLElement)
					}),
				),
			),
			dom.div(dom._class('pad'), dom._class('topBarMessageRow'),
				dom.clickbutton(dom._class('topBarMessageBack'), strokeIcon(strokePaths.back), attr.title(ui("Back to message list.")), attr.arialabel(ui("Back to message list.")), function click() {
					mobileBackToList()
				}),
				topBarMessageTitle=dom.span(dom._class('topBarMessageTitle')),
				dom.clickbutton(dom._class('topBarMobileOverflow'), strokeIcon(strokePaths.more), attr.title(ui("More actions.")), attr.arialabel(ui("More actions")), function click(e: MouseEvent) {
					showMobileOverflow(e.target! as HTMLElement)
				}),
			),
			dom.div(dom._class('pad'), dom._class('topBarStatusRow'),
				connectionElem=dom.div(),
				statusElem=dom.div(css('status', {marginLeft: '.5em', flexGrow: '1'}), attr.role('status')),
				dom.div(
					dom._class('topBarNav'),
					dom._class('topBarNavDesktop'),
					accountRoot=dom.div(dom._class('nav-account'),
						accountToggle=dom.clickbutton(
							dom._class('nav-account-toggle'),
							navIcon(strokePaths.circleUser, [['12', '12', '10'], ['12', '10', '3']]),
							loginAddressElem=dom.span(dom._class('nav-account-label')),
							navIcon(strokePaths.chevronDown, undefined, 'nav-account-caret'),
							attr.arialabel(ui('Account')),
							dom._attrs({'aria-haspopup': 'menu', 'aria-expanded': 'false'}),
							function click(e: MouseEvent) {
								e.stopPropagation()
								if (accountRoot.classList.contains('open')) {
									closeAccountMenu()
								} else {
									openAccountMenu()
								}
							},
						),
						accountMenu=dom.div(dom._class('nav-account-menu'),
							accountElem=dom.a(
								dom._class('nav-account-item'),
								attr.role('menuitem'),
								navIcon(strokePaths.user, [['12', '7', '4']]),
								ui('Account'),
							),
							accountCmdItem(navIcon(strokePaths.info, [['12', '12', '10']]), ui('Tooltip'), ui("Show tooltips, based on the title attributes (underdotted text) for the focused element and all user interface elements below it. Use the keyboard shortcut \"ctrl ?\" instead of clicking on the tooltip button, which changes focus to the tooltip button."), cmdTooltip),
							accountCmdItem(navIcon(strokePaths.bookOpen), ui('Help'), ui("Show popup with basic usage information and a keyboard shortcuts."), cmdHelp),
							settingsBtn=accountCmdItem(navIcon(strokePaths.settings, [['12', '12', '3']]), ui('Settings'), ui("Change settings for composing messages."), cmdSettings),
							dom.div(dom._class('nav-account-divider')),
							dom.clickbutton(
								dom._class('nav-account-item'),
								attr.role('menuitem'),
								navIcon(strokePaths.logOut),
								ui('Logout'),
								attr.title(ui("Logout, invalidating this session.")),
								async function click(e: MouseEvent) {
									closeAccountMenu()
									await withStatus(ui("Logging out"), client.Logout(), e.currentTarget as HTMLButtonElement)
									localStorageRemove('webmailcsrftoken')
									if (eventSource) {
										eventSource.close()
										eventSource = null
									}
									// Reload so all state is cleared from memory.
									window.location.reload()
								},
							),
							dom.div(dom._class('nav-account-divider')),
							layoutRow,
						),
					),
				),
			),
			dom.div(dom._class('theme-toggle-container'),
				dom.clickbutton(
					dom._class('lang-choice'),
					attr.title(ui('Language')),
					attr.arialabel(ui('Language')),
					langGlyph(),
					function click(e: MouseEvent) {
						const current = langPreference()
						const item = (id: 'auto' | 'en' | 'ru', label: string, title?: string) => {
							const on = current === id
							return dom.clickbutton(
								label,
								title ? attr.title(title) : [],
								on ? dom._attrs({'aria-current': 'true'}) : [],
								function click() {
									chooseLang(id)
								},
							)
						}
						menuPopover(e.currentTarget as HTMLElement, [
							item('auto', ui('Auto'), ui('Follow the browser language')),
							dom.div(dom._class('langRule'), attr.role('separator')),
							item('en', 'English'),
							item('ru', 'Русский'),
						], true, 'langMenu')
					},
				),
				dom.div(dom._class('theme-switch-group'),
				dom.label(
					dom._class('theme-toggle'),
					attr.title(ui('Light or dark theme')),
					dom.input(
						attr.type('checkbox'),
						attr.id('theme-toggle-switch'),
						attr.arialabel(ui('Dark theme')),
						function change(e: Event) {
							applyTheme((e.target as HTMLInputElement).checked ? 'dark' : 'light')
						},
					),
					dom.span(dom._class('slider'),
						dom.span(dom._class('theme-slot', 'theme-sun'), themeGlyph('sun')),
						dom.span(dom._class('theme-slot', 'theme-moon'), themeGlyph('moon')),
					),
				),
				dom.clickbutton(
					dom._class('theme-auto'),
					attr.id('theme-auto'),
					attr.title(ui('Auto')),
					attr.arialabel(ui('Auto')),
					themeGlyph('auto'),
					function click() {
						applyTheme('auto')
					},
				),
				),
			),
		),
		mailboxesListMsgBox=dom.div(
			css('mailboxesListMsgBox', {flexGrow: '1', position: 'relative'}),
			dom.div(dom._class('mailboxesBackdrop'), function click() {
				closeMailboxesDrawer()
			}),
			mailboxesElem=dom.div(mailboxesSidebarStyle, dom._class('mailboxesSidebar'),
				style({width: settings.mailboxesWidth + 'px'}),
				css('mailboxesBox', {display: 'flex', flexDirection: 'column', alignContent: 'stretch', position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', boxSizing: 'border-box'}),
				dom.div(dom._class('pad'), yscrollAutoStyle,
					style({flexGrow: '1', position: 'relative'}),
					mailboxlistView.root,
				),
			),
			mailboxessplitElem=dom.div(
				css('mailboxesListGrab', {position: 'absolute', width: '5px', top: 0, bottom: 0, cursor: 'ew-resize', zIndex: zindexes.splitter}),
				style({left: 'calc('+settings.mailboxesWidth +'px - 2px)'}),
				dom.div(
					css('mailboxesListLine', {position: 'absolute', width: '1px', top: 0, bottom: 0, left: '2px', right: '2px', backgroundColor: styles.popupBorderColor}),
				),
				function mousedown(e: MouseEvent) {
					startDrag(e, (e) => {
						const px = fitMailboxWidth(e.clientX)
						applyMailboxColumnWidth(px)
						settingsPut({...settings, mailboxesWidth: px})
					})
				}
			),
			splitElem=dom.div(css('listMsgBox', {position: 'absolute', left: 'calc(' + settings.mailboxesWidth+'px + 1px)', right: 0, top: 0, bottom: 0, backgroundColor: styles.backgroundColorMild}),
			),
		),
	)

	fitMailboxWidth = (want) => {
		const theme = document.querySelector('.theme-toggle-container')?.getBoundingClientRect().width ?? 0
		const nav = document.querySelector('.topBarNav')?.getBoundingClientRect().width ?? 0
		const connection = connectionElem.getBoundingClientRect().width
		const max = Math.max(160, Math.floor(window.innerWidth - theme - nav - connection - 160 - 48))
		return Math.min(max, Math.max(160, want))
	}
	applyMailboxColumnWidth = (px) => {
		topcomposeboxElem.style.width = px+'px'
		mailboxesElem.style.width = px+'px'
		mailboxessplitElem.style.left = 'calc('+px+'px - 2px)'
		splitElem.style.left = 'calc('+px+'px + 1px)'
	}

	msgPaneWrap=dom.div(dom._class('mobileMsgPane'),
		msgElem,
	)
	mobileMsgTitle=topBarMessageTitle

	// searchView is shown when search gets focus.
	const searchView = newSearchView(searchbarElem, mailboxlistView, startSearch, searchViewClose)

	document.body.addEventListener('keydown', async (e: KeyboardEvent) => {
		// Don't do anything for just the press of the modifiers.
		switch (e.key) {
		case 'OS':
		case 'Control':
		case 'Shift':
		case 'Alt':
			return
		}

		// Popup have their own handlers, e.g. for scrolling.
		if (popupOpen) {
			return
		}

		// Prevent many regular key presses from being processed, some possibly unintended.
		if ((e.target instanceof window.HTMLInputElement || e.target instanceof window.HTMLTextAreaElement || e.target instanceof window.HTMLSelectElement) && !e.ctrlKey && !e.altKey && !e.metaKey) {
			return
		}
		let l = []
		if (e.ctrlKey) {
			l.push('ctrl')
		}
		if (e.altKey) {
			l.push('alt')
		}
		if (e.metaKey) {
			l.push('meta')
		}
		// Assume regular keys generate a 1 character e.key, and others are special for
		// which we may want to treat shift specially too.
		if (e.key.length > 1 && e.shiftKey) {
			l.push('shift')
		}
		l.push(e.key)
		const k = l.join(' ')

		if (attachmentView) {
			attachmentView.key(k, e)
			return
		}
		if (composeView) {
			await composeView.key(k, e)
			return
		}
		const cmdfn = shortcuts[k]
		if (cmdfn) {
			e.preventDefault()
			e.stopPropagation()
			await cmdfn()
			return
		}
		msglistView.key(k, e)
	})

	const selectLayout = (want: string) => {
		if (want === currentLayout) {
			return
		}

		if (want === 'leftright') {
			let left: HTMLElement, split: HTMLElement, right: HTMLElement
			dom._kids(splitElem,
				left=dom.div(
					css('layoutLeft', {position: 'absolute', left: 0, top: 0, bottom: 0}),
					style({width: 'calc(' + settings.leftWidthPct + '% - 1px)'}),
					msglistElem,
				),
				split=dom.div(
					css('listMsgLeftRightGrab', {position: 'absolute', width: '5px', top: 0, bottom: 0, cursor: 'ew-resize', zIndex: zindexes.splitter}),
					style({left: 'calc(' + settings.leftWidthPct + '% - 2px)'}),
					dom.div(css('listMsgLeftRightLine', {position: 'absolute', backgroundColor: styles.popupBorderColor, top: 0, bottom: 0, width: '1px', left: '2px', right: '2px'})),
					async function mousedown(e: MouseEvent) {
						// Disable pointer events on the message view. If it has an iframe with a message,
						// mouse events while dragging would be consumed by the iframe, breaking our
						// resize.
						right.style.pointerEvents = 'none'
						await startDrag(e, (e) => {
							const bounds = left.getBoundingClientRect()
							const x = Math.round(e.clientX - bounds.x)
							left.style.width = 'calc(' + x +'px - 1px)'
							split.style.left = 'calc(' + x +'px - 2px)'
							right.style.left = 'calc(' + x+'px + 1px)'
							settingsPut({...settings, leftWidthPct: Math.round(100*bounds.width/splitElem.getBoundingClientRect().width)})
							updateMsglistWidths()
						})
						right.style.pointerEvents = ''
					}
				),
				right=dom.div(
					css('layoutRight', {position: 'absolute', right: 0, top: 0, bottom: 0}),
					style({left: 'calc(' + settings.leftWidthPct + '% + 1px)'}),
					msgPaneWrap,
				),
			)
		} else {
			let top: HTMLElement, split: HTMLElement, bottom: HTMLElement
			dom._kids(splitElem,
				top=dom.div(
					css('layoutTop', {position: 'absolute', top: 0, left: 0, right: 0}),
					style({height: 'calc(' + settings.topHeightPct + '% - 1px)'}),
					msglistElem,
				),
				split=dom.div(
					css('listMsgTopBottomGrab', {position: 'absolute', height: '5px', left: '0', right: '0', cursor: 'ns-resize', zIndex: zindexes.splitter}),
					style({top: 'calc(' + settings.topHeightPct + '% - 2px)'}),
					dom.div(css('listmsgTopBottomLine', {position: 'absolute', backgroundColor: styles.popupBorderColor, left: 0, right: 0, height: '1px', top: '2px', bottom: '2px'})),
					function mousedown(e: MouseEvent) {
						startDrag(e, (e) => {
							const bounds = top.getBoundingClientRect()
							const y = Math.round(e.clientY - bounds.y)
							top.style.height = 'calc(' + y + 'px - 1px)'
							split.style.top = 'calc(' + y + 'px - 2px)'
							bottom.style.top = 'calc(' + y +'px + 1px)'
							settingsPut({...settings, topHeightPct: Math.round(100*bounds.height/splitElem.getBoundingClientRect().height)})
						})
					}
				),
				bottom=dom.div(
					css('layoutBottom', {position: 'absolute', bottom: 0, left: 0, right: 0}),
					style({top: 'calc(' + settings.topHeightPct + '% + 1px)'}),
					msgPaneWrap,
				),
			)
		}
		currentLayout = want
		checkMsglistWidth()
		applyMobileLayoutStyles()
	}

	const autoselectLayout = () => {
		const want = window.innerWidth <= 2*2560/3 ? 'topbottom' : 'leftright'
		selectLayout(want)
	}

	applyLayoutMode = (id) => {
		settingsPut({...settings, layout: id})
		if (id === 'auto') {
			autoselectLayout()
		} else {
			selectLayout(id)
		}
		syncLayoutButtons()
	}

	// When the window size or layout changes, we recalculate the desired widths for
	// the msglist "table". It is a list of divs, each with flex layout with 4 elements
	// of fixed size.
	// Cannot use the CSSStyleSheet constructor with its replaceSync method because
	// safari only started implementing it in 2023q1. So we do it the old-fashioned
	// way, inserting a style element and updating its style.
	const styleElem = dom.style(attr.type('text/css'))
	document.head.appendChild(styleElem)
	const stylesheet = styleElem.sheet!

	let lastmsglistwidth = -1
	const checkMsglistWidth = () => {
		const width = msglistscrollElem.getBoundingClientRect().width
		if (lastmsglistwidth === width || width <= 0) {
			return
		}

		updateMsglistWidths()
	}
	let rulesInserted = false
	const measureColumn = (selector: string): number => {
		let max = 0
		msglistscrollElem.querySelectorAll(selector).forEach(node => {
			if (!(node instanceof HTMLElement)) {
				return
			}
			node.style.width = 'max-content'
			node.style.flexBasis = 'auto'
			node.style.overflow = 'visible'
			const w = Math.ceil(node.getBoundingClientRect().width)
			node.style.width = ''
			node.style.flexBasis = ''
			node.style.overflow = ''
			if (w > max) {
				max = w
			}
		})
		return max
	}
	const updateMsglistWidths = () => {
		const width = msglistscrollElem.clientWidth - 2 // Borders.
		lastmsglistwidth = width

		const flagsContent = measureColumn('.msgItemFlags')
		const ageContent = measureColumn('.msgItemAge')
		let flagswidth = isMobile() ? 28 : Math.max(settings.msglistflagsWidth, flagsContent)
		let agewidth = isMobile() ? 58 : Math.max(settings.msglistageWidth, ageContent)
		if (flagswidth + agewidth > width) {
			flagswidth = Math.floor(width/2)
			agewidth = width-flagswidth
		}
		const mainwidth = width - (flagswidth+agewidth)
		const cssRules: [string, {[style: string]: number | string}][] = [
			['.msgItemFlags', {width: flagswidth, 'flex-grow': 0, 'flex-shrink': 0, 'flex-basis': flagswidth}],
			['.msgItemMain', {width: mainwidth, 'flex-grow': 1, 'flex-shrink': 1, 'flex-basis': mainwidth, position: 'relative', 'min-width': 0, 'max-width': mainwidth}],
			['.msgItemAge', {width: agewidth, 'flex-grow': 0, 'flex-shrink': 0, 'flex-basis': agewidth, 'text-align': 'right'}],
			['.msgItemFlagsOffset', {left: flagswidth}],
			['.msgItemMainOffset', {left: flagswidth + mainwidth}],
		]
		if (!rulesInserted) {
			cssRules.forEach((rule, i) => { stylesheet.insertRule(rule[0] + '{}', i) })
			rulesInserted = true
		}
		cssRules.forEach((rule, i) => {
			const r = stylesheet.cssRules[i] as CSSStyleRule
			for (const k in rule[1]) {
				let v = rule[1][k]
				if (typeof v !== 'string') {
					v = ''+v+'px'
				}
				r.style.setProperty(k, v)
			}
		})
	}

	// Select initial layout.
	if (isMobile()) {
		selectLayout('topbottom')
	} else if (settings.layout === 'auto') {
		autoselectLayout()
	} else {
		selectLayout(settings.layout)
	}
	accountElem.hidden = true
	accountToggle.setAttribute('aria-haspopup', 'menu')
	accountToggle.setAttribute('aria-expanded', 'false')
	accountToggle.setAttribute('aria-label', ui('Account'))
	accountMenu.setAttribute('role', 'menu')
	// Rects stay 0 until the bar is in the document. Display reads the widths this clamp writes.
	document.body.appendChild(webmailroot)
	applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth))
	webmailroot.remove()
	if ((window as any).moxBeforeDisplay) {
		moxBeforeDisplay(webmailroot)
	}
	dom._kids(page, webmailroot)
	applyTheme(themePreference())
	updateMobileMode()
	if (isMobile()) {
		applyMobileLayoutStyles()
		setMobilePane('list')
	}
	checkMsglistWidth()
	let columnSync = 0
	const scheduleColumnSync = () => {
		if (columnSync) {
			return
		}
		columnSync = requestAnimationFrame(() => {
			columnSync = 0
			lastmsglistwidth = -1
			checkMsglistWidth()
		})
	}
	new MutationObserver(scheduleColumnSync).observe(msglistscrollElem, {childList: true, subtree: true})

	let lastViewportWidth = -1
	const syncViewportMode = () => {
		const width = viewportWidth()
		if (width === lastViewportWidth) {
			return
		}
		lastViewportWidth = width
		const wasMobile = document.documentElement.classList.contains('mobile')
		updateMobileMode()
		const nowMobile = isMobile()
		if (nowMobile) {
			if (currentLayout !== 'topbottom') {
				selectLayout('topbottom')
			}
			applyMobileLayoutStyles()
			if (!wasMobile) {
				setMobilePane(msglistView.activeMessageID() ? 'message' : 'list')
			}
		} else if (wasMobile) {
			document.documentElement.classList.remove('mobile-pane-list', 'mobile-pane-message', 'mailboxes-drawer-open')
			if (settings.layout === 'auto') {
				autoselectLayout()
			} else {
				selectLayout(settings.layout)
			}
			applyMobileLayoutStyles()
		} else {
			applyMobileLayoutStyles()
			if (settings.layout === 'auto') {
				autoselectLayout()
			}
		}
		checkMsglistWidth()
		if (searchView.root.parentElement) {
			positionSearchView()
		}
	}
	window.addEventListener('resize', syncViewportMode)
	new ResizeObserver(syncViewportMode).observe(document.documentElement)

	window.addEventListener('hashchange', async (e: HashChangeEvent) => {
		const hash = decodeURIComponent(window.location.hash)
		if (hash.startsWith('#compose ')) {
			try {
				const opts = parseComposeMailto(hash.substring('#compose '.length))

				// Restore previous hash.
				if (e.oldURL) {
					const ou = new URL(e.oldURL)
					window.location.hash = ou.hash
				} else {
					window.location.hash = ''
				}

				(async () => {
					// Resolve Q/B-word mime encoding for subject. ../rfc/6068:267 ../rfc/2047:180
					if (opts.subject && opts.subject.includes('=?')) {
						opts.subject = await withStatus(ui("Decoding MIME words for subject"), client.DecodeMIMEWords(opts.subject))
					}
					compose(opts, listMailboxes, setLocationHash)
				})()
			} catch (err) {
				window.alert(ui("Error parsing compose mailto URL: ")+errmsg(err))
				window.location.hash = ''
			}
			return
		}

		const [search, msgid, editMsgid, f, notf] = parseLocationHash(mailboxlistView)

		requestMsgID = msgid
		if (search) {
			mailboxlistView.closeMailbox()
			loadSearch(search)
		} else {
			unloadSearch()
			await mailboxlistView.openMailboxID(f.MailboxID, false)
		}
		if (editMsgid) {
			// Open compose window for draft message in parallel, not failing on error.
			(async () => {
				try {
					const [mi, pm] = await withStatus(ui("Loading compose message"), Promise.all([client.MessageItem(editMsgid), client.ParsedMessage(editMsgid)]))
					await composeDraft(mi, pm, listMailboxes, setLocationHash)
				} catch (err) {
					window.alert(ui("Error opening draft message: ")+errmsg(err))
				}
			})()
		}
		await withStatus(ui("Requesting messages"), requestNewView(false, f, notf))
	})


	let eventSource: EventSource | null = null // If set, we have a connection.
	let connecting = false // Check before reconnecting.
	// autoreconnect is set to 0 when one reconnect attempt fails, which is cleared by
	// window "focus" event. Set to -1 on fatal protocol errors, not cleared by window
	// "focus" event (i.e. after the alert box is closed).
	let autoReconnect = 1
	let autoReconnectResetTimer = 0 // Timer ID for resetting autoReconnect.
	// Set to timer when we plan to reconnect after a server shutdown. Cleared when we
	// try to connect.
	let shutdownReconnectTimer = 0

	// Don't show disconnection just before user navigates away.
	let leaving = false
	window.addEventListener('beforeunload', (e: BeforeUnloadEvent) => {
		if (composeView && composeView.unsavedChanges()) {
			e.preventDefault()
		} else {
			leaving = true
			if (eventSource) {
				eventSource.close()
				eventSource = null
				sseID = 0
			}
		}
	})

	// On chromium, we may get restored when user hits the back button ("bfcache"). We
	// have left, closed the connection, so we should restore it.
	window.addEventListener('pageshow', async (e: PageTransitionEvent) => {
		if (e.persisted && !eventSource && !connecting) {
			autoReconnect = 1
			connect(false)
		}
	})

	// If user comes back to tab/window, and we are disconnected, try another reconnect.
	window.addEventListener('focus', () => {
		if (!eventSource && !connecting && autoReconnect >= 0) {
			autoReconnect = 0
			connect(true)
		}
	})

	const showNotConnected = () => {
		dom._kids(connectionElem,
			attr.role('status'),
			dom.span(css('connectionStatus', {backgroundColor: styles.warningBackgroundColor, padding: '2px 8px', borderRadius: styles.radius, fontSize: '12px'}), ui("Not connected"), attr.title(ui("Not receiving real-time updates, including of new deliveries."))),
			' ',
			dom.clickbutton(ui('Reconnect'), function click() {
				if (!eventSource && !connecting) {
					autoReconnect = 1
					connect(true)
				}
			}),
		)
	}

	const capitalizeFirst = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

	// Set to compose options when we were opened with a mailto URL. We open the
	// compose window after we received the "start" message with our addresses.
	let openComposeOptions: ComposeOptions | undefined
	// Set during connect when we need to open a message for composing after getting
	// connected.
	let connectOpenComposeMessageID = 0

	const uiConnectionStatus = (connected: boolean) => {
		faviconDraw()

		composeBtn.disabled = !connected
		settingsBtn.disabled = !connected

		const toggle = (e: HTMLElement) => {
			e.style.opacity = connected ? '' : '.3'
			e.style.pointerEvents = connected ? '' : 'none' // Prevent mouse events.
			e.toggleAttribute('inert', !connected) // Prevent navigation through keyboard.
		}

		toggle(searchbarElemBox)
		toggle(mailboxesListMsgBox)
	}

	uiConnectionStatus(false)

	const connect = async (isreconnect: boolean) => {
		if (shutdownReconnectTimer) {
			window.clearTimeout(shutdownReconnectTimer)
			shutdownReconnectTimer = 0
		}
		connectionElem.classList.toggle('loading', true)
		dom._kids(connectionElem)
		connectionElem.classList.toggle('loading', false)

		autoReconnect = isreconnect ? 0 : 1
		connecting = true

		let token: string
		try {
			token = await withStatus(ui("Fetching token for connection with real-time updates"), client.Token(), undefined, true)
		} catch (err) {
			connecting = false
			autoReconnect = 0
			dom._kids(statusElem, (capitalizeFirst((err as any).message || ui('Error fetching connection token')))+ui(', not automatically retrying. '))
			showNotConnected()
			return
		}

		const h = decodeURIComponent(window.location.hash)
		if (h.startsWith('#compose ')) {
			try {
				// The compose window is opened when we get the "start" event, which gives us our
				// configuration.
				openComposeOptions = parseComposeMailto(h.substring('#compose '.length))
			} catch (err) {
				window.alert(ui("Error parsing mailto URL: ")+errmsg(err))
			}
			window.location.hash = ''
		}

		let [searchQuery, msgid, editMsgid, f, notf] = parseLocationHash(mailboxlistView)
		if (editMsgid && !composeView) {
			connectOpenComposeMessageID = editMsgid
		}
		requestMsgID = msgid
		requestFilter = f
		requestNotFilter = notf
		if (searchQuery) {
			loadSearch(searchQuery)
		}
		[f, notf] = refineFilters(requestFilter, requestNotFilter)
		const fetchCount = Math.max(50, 3*Math.ceil(msglistscrollElem.getBoundingClientRect().height/msglistView.itemHeight()))
		const query = {
			OrderAsc: settings.orderAsc,
			Threading: settings.threading,
			Filter: f,
			NotFilter: notf,
		}
		const page = {
			AnchorMessageID: 0,
			Count: fetchCount,
			DestMessageID: msgid,
		}

		viewSequence++
		viewID = viewSequence

		// We get an implicit query for the automatically selected mailbox or query.
		requestSequence++
		requestID = requestSequence
		requestAnchorMessageID = 0
		requestViewEnd = false
		clearList()

		const request = {
			ID: requestID,
			// A new SSEID is created by the server, sent in the initial response message.
			ViewID: viewID,
			Query: query,
			Page: page,
		}

		let slow = ''
		try {
			const debug = JSON.parse(localStorage.getItem('sherpats-debug') || 'null')
			if (debug && debug.waitMinMsec && debug.waitMaxMsec) {
				slow = '&waitMinMsec='+debug.waitMinMsec + '&waitMaxMsec='+debug.waitMaxMsec
			}
		} catch (err) {}

		eventSource = new window.EventSource('events?singleUseToken=' + encodeURIComponent(token)+'&request='+encodeURIComponent(JSON.stringify(request))+slow)
		let eventID = window.setTimeout(() => dom._kids(statusElem, ui("Connecting... ")), 1000)
		eventSource.addEventListener('open', (e: Event) => {
			log('eventsource open', {e})
			if (eventID) {
				window.clearTimeout(eventID)
				eventID = 0
			}
			dom._kids(statusElem)
			dom._kids(connectionElem)
		})

		const sseError = (errmsg: string, addNotRetrying: boolean) => {
			uiConnectionStatus(false)
			sseID = 0
			eventSource!.close()
			eventSource = null
			connecting = false
			if (autoReconnectResetTimer) {
				clearTimeout(autoReconnectResetTimer)
				autoReconnectResetTimer = 0
			}
			if (leaving) {
				return
			}
			if (eventID) {
				window.clearTimeout(eventID)
				eventID = 0
			}
			document.title = [ui('(not connected)'), loginAddress ? (loginAddress.User+'@'+formatDomain(loginAddress.Domain)) : '', 'Mox Webmail'].filter(s => s).join(' - ')
			dom._kids(connectionElem)
			if (autoReconnect < 1) {
				let msg = capitalizeFirst(errmsg)
				if (addNotRetrying) {
					msg += ui(', not automatically retrying. ')
				}
				dom._kids(statusElem, msg)
				showNotConnected()
				listloadingElem.remove()
				listendElem.remove()
			} else {
				connect(true)
			}
		}
		// EventSource-connection error. No details.
		eventSource.addEventListener('error', (e: Event) => {
			log('eventsource error', {e}, JSON.stringify(e))
			sseError(ui("Connection failed"), true)
		})
		// Fatal error on the server side, error message propagated, but connection needs to be closed.
		eventSource.addEventListener('fatalErr', (e: MessageEvent) => {
			const errmsg = JSON.parse(e.data) as string || ui('(no error message)')
			sseError(ui("Server error: \"") + errmsg + '"', true)
		})
		// Server is stopping, we'll assume for a restart, and will try to reconnect with some jitter.
		eventSource.addEventListener('serverShutdown', (_: MessageEvent) => {
			autoReconnect = 0
			sseError(ui("Server shutting down, will try to reconnect in a few seconds"), false)

			shutdownReconnectTimer = window.setTimeout(() => {
				connect(true)
			}, 3000 + Math.floor(Math.random()*5000))
		})

		const checkParse = <T>(fn: () => T): T => {
			try {
				return fn()
			} catch (err) {
				const errmsg = ui("invalid event from server: ") + ((err as any).message || ui('(no message)'))
				window.alert(errmsg)
				autoReconnect = -1
				sseError(errmsg, true)
				throw err
			}
		}

		eventSource.addEventListener('start', (e: MessageEvent) => {
			const data = JSON.parse(e.data)
			if (lastServerVersion && data.Version !== lastServerVersion) {
				let reload = true
				// Save changes to draft before reload.
				if (composeView && composeView.unsavedChanges()) {
					try {
						withStatus(ui("Saving before reloading due to server update"), composeView.save())
					} catch (err) {
						window.alert(ui("Server was updated, and webmail wants to reload to get the latest changes, but encountered an error while saving changes your open draft message. Please reload at your earliest convenience."))
						reload = false
					}
				}
				if (reload) {
					// Cannot use location.reload, must use a cache buster, otherwise browser may use
					// the same HTML/JS. We remove the '?v=...' again on page load.
					const u = URL.parse(window.location.href)!
					u.search = '?v='+data.Version + (u.search ? '&'+u.search.substring(1) : '')
					window.location.href = u.toString()
					return
				}
			}
			lastServerVersion = data.Version

			const start = checkParse(() => api.parser.EventStart(data))
			log('event start', start)

			accountSettings = start.Settings
			introboxMailbox = start.Introbox
			connecting = false
			sseID = start.SSEID
			loginAddress = start.LoginAddress
			if (start.AccountPath) {
				accountElem.setAttribute('href', start.AccountPath)
				accountElem.hidden = false
			} else {
				accountElem.hidden = true
			}
			const loginAddr = formatEmail(loginAddress)
			dom._kids(loginAddressElem, loginAddr)
			accountToggle.title = loginAddr
			if (!isMobile()) {
				applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth))
			}
			accountAddresses = start.Addresses || []
			accountAddresses.sort((a, b) => {
				if (formatEmail(a) === loginAddr) {
					return -1
				}
				if (formatEmail(b) === loginAddr) {
					return 1
				}
				if (a.Domain.ASCII !== b.Domain.ASCII) {
					return a.Domain.ASCII < b.Domain.ASCII ? -1 : 1
				}
				return a.User < b.User ? -1 : 1
			})
			domainAddressConfigs = start.DomainAddressConfigs || {}
			rejectsMailbox = start.RejectsMailbox

			clearList()

			// If we were opened through a mailto: link, it's time to open the compose window.
			if (openComposeOptions) {
				(async () => {
					// Resolve Q/B-word mime encoding for subject. ../rfc/6068:267 ../rfc/2047:180
					if (openComposeOptions.subject && openComposeOptions.subject.includes('=?')) {
						openComposeOptions.subject = await withStatus(ui("Decoding MIME words for subject"), client.DecodeMIMEWords(openComposeOptions.subject))
					}
					compose(openComposeOptions, listMailboxes, setLocationHash)
					openComposeOptions = undefined
				})()
			}
			if (connectOpenComposeMessageID) {
				// Open compose window for draft message in parallel, not failing on error.
				(async () => {
					const editMsgid = connectOpenComposeMessageID
					connectOpenComposeMessageID = 0
					try {
						const [mi, pm] = await withStatus(ui("Loading compose message"), Promise.all([client.MessageItem(editMsgid), client.ParsedMessage(editMsgid)]))
						await composeDraft(mi, pm, listMailboxes, setLocationHash)
					} catch (err) {
						window.alert(ui("Error opening draft message: ")+errmsg(err))
					}
				})()
			}

			let mailboxName = start.MailboxName
			let mb = (start.Mailboxes || []).find(mb => mb.Name === start.MailboxName)
			if (mb) {
				requestFilter.MailboxID = mb.ID // For check to display mailboxname in msgitemView.
			}
			if (mailboxName === '') {
				mailboxName = (start.Mailboxes || []).find(mb => mb.ID === requestFilter.MailboxID)?.Name || ''
			}
			mailboxlistView.loadMailboxes(start.Mailboxes || [], search.active ? undefined : mailboxName)
			if (searchView.root.parentElement) {
				searchView.ensureLoaded()
			}

			if (!mb) {
				updatePageTitle()
			}
			dom._kids(queryactivityElem, ui("loading..."))
			msglistscrollElem.appendChild(listloadingElem)

			// We'll set autoReconnect to 1 when we've held a connection for 5 seconds. Firefox
			// disconnects often, on any network change including with docker container starts,
			// such as for integration tests.
			autoReconnectResetTimer = window.setTimeout(() => {
				autoReconnect = 1
				autoReconnectResetTimer = 0
			}, 5*1000)

			uiConnectionStatus(true)
		})
		eventSource.addEventListener('viewErr', async (e: MessageEvent) => {
			const viewErr = checkParse(() => api.parser.EventViewErr(JSON.parse(e.data)))
			log('event viewErr', viewErr)
			if (viewErr.ViewID !== viewID || viewErr.RequestID !== requestID) {
				log('received viewErr for other viewID or requestID', {expected: {viewID, requestID}, got: {viewID: viewErr.ViewID, requestID: viewErr.RequestID}})
				return
			}

			viewID = 0
			requestID = 0

			dom._kids(queryactivityElem)
			listloadingElem.remove()
			listerrElem.remove()
			dom._kids(listerrElem, ui("Error from server during request for messages: ")+viewErr.Err)
			msglistscrollElem.appendChild(listerrElem)
			window.alert(ui("Error from server during request for messages: ")+viewErr.Err)
		})
		eventSource.addEventListener('viewReset', async (e: MessageEvent) => {
			const viewReset = checkParse(() => api.parser.EventViewReset(JSON.parse(e.data)))
			log('event viewReset', viewReset)
			if (viewReset.ViewID !== viewID || viewReset.RequestID !== requestID) {
				log('received viewReset for other viewID or requestID', {expected: {viewID, requestID}, got: {viewID: viewReset.ViewID, requestID: viewReset.RequestID}})
				return
			}

			clearList()
			dom._kids(queryactivityElem, ui("loading..."))
			msglistscrollElem.appendChild(listloadingElem)
			window.alert(ui("Could not find message to continue scrolling, resetting the view."))
		})
		eventSource.addEventListener('viewMsgs', async (e: MessageEvent) => {
			const viewMsgs = checkParse(() => api.parser.EventViewMsgs(JSON.parse(e.data)))
			log('event viewMsgs', viewMsgs)
			if (viewMsgs.ViewID !== viewID || viewMsgs.RequestID !== requestID) {
				log('received viewMsgs for other viewID or requestID', {expected: {viewID, requestID}, got: {viewID: viewMsgs.ViewID, requestID: viewMsgs.RequestID}})
				return
			}

			msglistView.root.classList.toggle('loading', false)
			if (viewMsgs.MessageItems) {
				msglistView.addMessageItems(viewMsgs.MessageItems || [], false, requestMsgID)
			}

			// DestMessageID 0 makes the server attach a parsed message anyway: the newest
			// one, or the first unread in its thread. That is a desktop preview. On
			// mobile it would replace the list before the user picks a message. A
			// message id in the URL is an explicit choice and still opens.
			if (viewMsgs.ParsedMessage && !(isMobile() && requestMsgID === 0)) {
				const ok = msglistView.openMessage(viewMsgs.ParsedMessage)
				if (!ok) {
					// Should not happen, server would be sending a parsedmessage while not including the message itself.
					requestMsgID = 0
					setLocationHash()
				}
			}

			if (viewMsgs.MessageItems && viewMsgs.MessageItems.length > 0) {
				requestAnchorMessageID = viewMsgs.MessageItems[viewMsgs.MessageItems.length-1]![0]!.Message.ID
			}
			requestViewEnd = viewMsgs.ViewEnd
			if (requestViewEnd) {
				msglistscrollElem.appendChild(listendElem)
			}
			if ((viewMsgs.MessageItems || []).length === 0 || requestViewEnd) {
				dom._kids(queryactivityElem)
				listloadingElem.remove()
				requestID = 0
				if (requestMsgID) {
					requestMsgID = 0
					setLocationHash()
				}
			}
		})
		eventSource.addEventListener('viewChanges', async (e: MessageEvent) => {
			const viewChanges = checkParse(() => api.parser.EventViewChanges(JSON.parse(e.data)))
			log('event viewChanges', viewChanges)
			if (viewChanges.ViewID !== viewID) {
				log('received viewChanges for other viewID', {expected: viewID, got: viewChanges.ViewID})
				return
			}

			try {
				(viewChanges.Changes || []).forEach(tc => {
					if (!tc) {
						return
					}
					const [tag, x] = tc
					if (tag === 'ChangeMailboxCounts') {
						const c = api.parser.ChangeMailboxCounts(x)
						mailboxlistView.setMailboxCounts(c.MailboxID, c.Total, c.Unread)
					} else if (tag === 'ChangeMailboxSpecialUse') {
						const c = api.parser.ChangeMailboxSpecialUse(x)
						mailboxlistView.setMailboxSpecialUse(c.MailboxID, c.SpecialUse)
					} else if (tag === 'ChangeMailboxKeywords') {
						const c = api.parser.ChangeMailboxKeywords(x)
						mailboxlistView.setMailboxKeywords(c.MailboxID, c.Keywords || [])
					} else if (tag === 'ChangeMsgAdd') {
						const c = api.parser.ChangeMsgAdd(x)
						msglistView.addMessageItems([c.MessageItems || []], true, 0)
					} else if (tag === 'ChangeMsgRemove') {
						const c = api.parser.ChangeMsgRemove(x)
						msglistView.removeUIDs(c.MailboxID, c.UIDs || [])
					} else if (tag === 'ChangeMsgFlags') {
						const c = api.parser.ChangeMsgFlags(x)
						msglistView.updateFlags(c.MailboxID, c.UID, c.ModSeq, c.Mask, c.Flags, c.Keywords || [])
					} else if (tag === 'ChangeMsgThread') {
						const c = api.parser.ChangeMsgThread(x)
						if (c.MessageIDs) {
							msglistView.updateMessageThreadFields(c.MessageIDs, c.Muted, c.Collapsed)
						}
					} else if (tag === 'ChangeMailboxRemove') {
						const c = api.parser.ChangeMailboxRemove(x)
						mailboxlistView.removeMailbox(c.MailboxID)
					} else if (tag === 'ChangeMailboxAdd') {
						const c = api.parser.ChangeMailboxAdd(x)
						mailboxlistView.addMailbox(c.Mailbox)
					} else if (tag === 'ChangeMailboxRename') {
						const c = api.parser.ChangeMailboxRename(x)
						mailboxlistView.renameMailbox(c.MailboxID, c.NewName)
					} else {
						throw new Error('unknown change tag ' + tag)
					}
				})

				faviconDraw()
			} catch (err) {
				window.alert(ui("Error processing changes (reloading advised): ") + errmsg(err))
			}
		})
	}
	connect(false)
}

window.addEventListener('load', async () => {
	try {
		await init()
	} catch (err) {
		window.alert(ui("Error: ") + errmsg(err))
	}
})

// Keep original URL of page load, so we can remove it from stack trace if we need to.
const origLocation = {
	href: window.location.href,
	protocol: window.location.protocol,
	host: window.location.host,
	pathname: window.location.pathname,
	search: window.location.search,
}

// If a JS error happens, show a box in the lower left corner, with a button to
// show details, in a popup. The popup shows the error message and a link to github
// to create an issue. We want to lower the barrier to give feedback.
const showUnhandledError = (err: Error, lineno: number, colno: number) => {
	console.log('unhandled error', err)
	if (settings.ignoreErrorsUntil > new Date().getTime()/1000) {
		return
	}
	let stack = err.stack || ''
	if (stack) {
		log({stack})
		// At the time of writing, Firefox has stacks with full location.href of original
		// page load including hash. Chromium has location.href without hash.
		const loc = origLocation
		stack = '\n'+stack.replaceAll(loc.href, 'webmail.html').replaceAll(loc.protocol + '//' + loc.host + loc.pathname + loc.search, 'webmail.html')
	} else {
		stack = ' (not available)'
	}
	const xerrmsg = err.toString()
	const box = dom.div(
		css('unhandledErrorBox', {position: 'absolute', bottom: '1ex', left: '1ex', backgroundColor: 'rgba(255, 110, 110, .9)', maxWidth: '14em', padding: '.25em .5em', borderRadius: '.25em', fontSize: '.8em', wordBreak: 'break-all', zIndex: zindexes.shortcut}),
		dom.div(style({marginBottom: '.5ex'}), ''+xerrmsg),
		dom.clickbutton(ui('Details'), function click() {
			box.remove()
			let msg = `Mox version: ${moxversion} (${moxgoos}/${moxgoarch})
Browser: ${window.navigator.userAgent}
File: webmail.html
Lineno: ${lineno || '-'}
Colno: ${colno || '-'}
Message: ${xerrmsg}

Stack trace: ${stack}
`

			const body = `[Hi! Please replace this text with an explanation of what you did to trigger this errors. It will help us reproduce the problem. The more details, the more likely it is we can find and fix the problem. If you don't know how or why it happened, that's ok, it is still useful to report the problem. If no stack trace was found and included below, and you are a developer, you can probably find more details about the error in the browser developer console. Thanks!]

Details of the error and browser:

`+'```\n'+msg+'```\n'

			const remove = popup(
				dom.div(
					dom._class('dialogPanel'),
					dom._class('errorPanel'),
					dom.div(dom._class('dialogHeader'),
						dom.h1(ui("A JavaScript error occurred")),
						dom.clickbutton(dom._class('btnIcon'), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close error details.")), function click() {
							remove()
						}),
					),
					dom.div(dom._class('dialogBody'),
						dom.pre(dom._class('errorPre'), msg),
						dom.p(ui("There is a good chance this is a bug in Mox Webmail.")),
						dom.p(ui("Consider filing a bug report (\"issue\") at "), link('https://github.com/mjl-/mox/issues/new?title='+encodeURIComponent(ui("mox webmail js error: \"")+xerrmsg+'"')+'&body='+encodeURIComponent(body), 'https://github.com/mjl-/mox/issues/new'), ui(". The link includes the error details.")),
						dom.p(ui("Before reporting you could check previous "), link('https://github.com/mjl-/mox/issues?q=is%3Aissue+"mox+webmail+js+error%3A"', ui("webmail bug reports")), '.'),
						dom.p(ui("Your feedback will help improve mox, thanks!")),
					),
					dom.div(dom._class('dialogFooter'),
						dom.clickbutton(ui("Close"), function click() {
							remove()
						}),
						dom.clickbutton(dom._class('btnPrimary'), ui("Silence for 1 week"), function click() {
							remove()
							settingsPut({...settings, ignoreErrorsUntil: Math.round(new Date().getTime()/1000 + 7*24*3600)})
						}),
					),
				),
			)
		}), ' ',
		dom.clickbutton(ui('Ignore'), function click() {
			box.remove()
		}),
	)
	document.body.appendChild(box)
}

// We don't catch all errors, we use throws to not continue executing javascript.
// But for JavaScript-level errors, we want to show a warning to helpfully get the
// user to submit a bug report.
window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
	if (!e.reason) {
		return
	}
	const err = e.reason
	if (err instanceof EvalError || err instanceof RangeError || err instanceof ReferenceError || err instanceof SyntaxError || err instanceof TypeError || err instanceof URIError || err instanceof ConsistencyError) {
		showUnhandledError(err, 0, 0)
	} else {
		console.log('unhandled promiserejection', err, e.promise)
	}
})
// Window-level errors aren't that likely, since all code is in the init promise,
// but doesn't hurt to register an handler.
window.addEventListener('error', e => {
	showUnhandledError(e.error, e.lineno, e.colno)
})
