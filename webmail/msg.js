(() => {
	var __defProp = Object.defineProperty;
	var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

	// .js/lib.js
	var scriptblocks = [0, 128, 256, 384, 592, 688, 768, 880, 1024, 1280, 1328, 1424, 1536, 1792, 1872, 1920, 1984, 2048, 2112, 2144, 2160, 2208, 2304, 2432, 2560, 2688, 2816, 2944, 3072, 3200, 3328, 3456, 3584, 3712, 3840, 4096, 4256, 4352, 4608, 4992, 5024, 5120, 5760, 5792, 5888, 5920, 5952, 5984, 6016, 6144, 6320, 6400, 6480, 6528, 6624, 6656, 6688, 6832, 6912, 7040, 7104, 7168, 7248, 7296, 7312, 7360, 7376, 7424, 7552, 7616, 7680, 7936, 8192, 8304, 8352, 8400, 8448, 8528, 8592, 8704, 8960, 9216, 9280, 9312, 9472, 9600, 9632, 9728, 9984, 10176, 10224, 10240, 10496, 10624, 10752, 11008, 11264, 11360, 11392, 11520, 11568, 11648, 11744, 11776, 11904, 12032, 12272, 12288, 12352, 12448, 12544, 12592, 12688, 12704, 12736, 12784, 12800, 13056, 13312, 19904, 19968, 40960, 42128, 42192, 42240, 42560, 42656, 42752, 42784, 43008, 43056, 43072, 43136, 43232, 43264, 43312, 43360, 43392, 43488, 43520, 43616, 43648, 43744, 43776, 43824, 43888, 43968, 44032, 55216, 55296, 56192, 56320, 57344, 63744, 64256, 64336, 65024, 65040, 65056, 65072, 65104, 65136, 65280, 65520, 65536, 65664, 65792, 65856, 65936, 66e3, 66176, 66208, 66272, 66304, 66352, 66384, 66432, 66464, 66560, 66640, 66688, 66736, 66816, 66864, 66928, 67072, 67456, 67584, 67648, 67680, 67712, 67808, 67840, 67872, 67968, 68e3, 68096, 68192, 68224, 68288, 68352, 68416, 68448, 68480, 68608, 68736, 68864, 69216, 69248, 69312, 69376, 69424, 69488, 69552, 69600, 69632, 69760, 69840, 69888, 69968, 70016, 70112, 70144, 70272, 70320, 70400, 70656, 70784, 71040, 71168, 71264, 71296, 71424, 71680, 71840, 71936, 72096, 72192, 72272, 72368, 72384, 72448, 72704, 72816, 72960, 73056, 73440, 73472, 73648, 73664, 73728, 74752, 74880, 77712, 77824, 78896, 82944, 92160, 92736, 92784, 92880, 92928, 93760, 93952, 94176, 94208, 100352, 101120, 101632, 110576, 110592, 110848, 110896, 110960, 113664, 113824, 118528, 118784, 119040, 119296, 119488, 119520, 119552, 119648, 119808, 120832, 122624, 122880, 122928, 123136, 123536, 123584, 124112, 124896, 124928, 125184, 126064, 126208, 126464, 126976, 127024, 127136, 127232, 127488, 127744, 128512, 128592, 128640, 128768, 128896, 129024, 129280, 129536, 129648, 129792, 131072, 173824, 177984, 178208, 183984, 194560, 196608, 201552, 917504, 917760, 983040, 1048576];
	var findBlock = /* @__PURE__ */ __name((code) => {
		let s = 0;
		let e = scriptblocks.length;
		while (s < e - 1) {
			let i = Math.floor((s + e) / 2);
			if (code < scriptblocks[i]) {
				e = i;
			} else {
				s = i;
			}
		}
		return s;
	}, "findBlock");
	var letterScript = /* @__PURE__ */ __name((code) => {
		if (code <= 591 || code >= 7680 && code <= 7935 || code >= 11360 && code <= 11391 || code >= 42784 && code <= 43007 || code >= 43824 && code <= 43887) {
			return 0;
		}
		if (code >= 880 && code <= 1023 || code >= 7936 && code <= 8191) {
			return 1;
		}
		if (code >= 1024 && code <= 1327 || code >= 7296 && code <= 7311 || code >= 11744 && code <= 11775 || code >= 42560 && code <= 42655) {
			return 2;
		}
		return 1e3 + findBlock(code);
	}, "letterScript");
	var isLetter = /* @__PURE__ */ __name((code) => /\p{L}/u.test(String.fromCodePoint(code)), "isLetter");
	var formatText = /* @__PURE__ */ __name((e, s) => {
		if (!s) {
			return;
		}
		let ascii = true;
		for (const c of s) {
			const cp = c.codePointAt(0);
			if (cp !== void 0 && cp >= 128) {
				ascii = false;
				break;
			}
		}
		if (ascii) {
			e.appendChild(document.createTextNode(s));
			return;
		}
		for (const part of s.split(/([ \t\r\n]+)/)) {
			if (!part) {
				continue;
			}
			if (/^[ \t\r\n]+$/.test(part)) {
				e.appendChild(document.createTextNode(part));
				continue;
			}
			const runs = [];
			const scripts = /* @__PURE__ */ new Set();
			let buf = "";
			let bufScript = -2;
			const flush = /* @__PURE__ */ __name(() => {
				if (!buf) {
					return;
				}
				runs.push({ script: bufScript, text: buf });
				if (bufScript >= 0) {
					scripts.add(bufScript);
				}
				buf = "";
			}, "flush");
			for (const c of part) {
				const code = c.codePointAt(0);
				const script = isLetter(code) ? letterScript(code) : -1;
				if (script !== bufScript) {
					flush();
					bufScript = script;
				}
				buf += c;
			}
			flush();
			const mixed = scripts.size >= 2;
			let first = -1;
			for (const run of runs) {
				if (run.script >= 0) {
					first = run.script;
					break;
				}
			}
			for (const run of runs) {
				if (mixed && run.script >= 0 && run.script !== first) {
					const x = document.createElement("span");
					x.classList.add("scriptswitch");
					x.title = "This word mixes scripts. That can imitate another word.";
					x.appendChild(document.createTextNode(run.text));
					e.appendChild(x);
				} else {
					e.appendChild(document.createTextNode(run.text));
				}
			}
		}
	}, "formatText");
	var _domKids = /* @__PURE__ */ __name((e, l) => {
		l.forEach((c) => {
			const xc = c;
			if (typeof c === "string") {
				formatText(e, c);
			} else if (c instanceof String) {
				e.appendChild(document.createTextNode("" + c));
			} else if (c instanceof Element) {
				e.appendChild(c);
			} else if (c instanceof Function) {
				if (!c.name) {
					throw new Error("function without name");
				}
				e.addEventListener(c.name, c);
			} else if (Array.isArray(xc)) {
				_domKids(e, c);
			} else if (xc._class) {
				for (const s of xc._class) {
					e.classList.toggle(s, true);
				}
			} else if (xc._attrs) {
				for (const k in xc._attrs) {
					e.setAttribute(k, xc._attrs[k]);
				}
			} else if (xc._styles) {
				for (const k in xc._styles) {
					const estyle = e.style;
					estyle[k] = xc._styles[k];
				}
			} else if (xc._props) {
				for (const k in xc._props) {
					const eprops = e;
					eprops[k] = xc._props[k];
				}
			} else if (xc.root) {
				e.appendChild(xc.root);
			} else {
				console.log("bad kid", c);
				throw new Error("bad kid");
			}
		});
		return e;
	}, "_domKids");
	var dom = {
		_kids: /* @__PURE__ */ __name(function(e, ...kl) {
			while (e.firstChild) {
				e.removeChild(e.firstChild);
			}
			_domKids(e, kl);
		}, "_kids"),
		_attrs: /* @__PURE__ */ __name((x) => {
			return { _attrs: x };
		}, "_attrs"),
		_class: /* @__PURE__ */ __name((...x) => {
			return { _class: x };
		}, "_class"),
		// The createElement calls are spelled out so typescript can derive function
		// signatures with a specific HTML*Element return type.
		div: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("div"), l), "div"),
		span: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("span"), l), "span"),
		a: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("a"), l), "a"),
		input: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("input"), l), "input"),
		textarea: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("textarea"), l), "textarea"),
		select: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("select"), l), "select"),
		option: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("option"), l), "option"),
		clickbutton: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("button"), [attr.type("button"), ...l]), "clickbutton"),
		submitbutton: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("button"), [attr.type("submit"), ...l]), "submitbutton"),
		form: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("form"), l), "form"),
		fieldset: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("fieldset"), l), "fieldset"),
		table: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("table"), l), "table"),
		thead: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("thead"), l), "thead"),
		tbody: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("tbody"), l), "tbody"),
		tfoot: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("tfoot"), l), "tfoot"),
		tr: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("tr"), l), "tr"),
		td: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("td"), l), "td"),
		th: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("th"), l), "th"),
		datalist: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("datalist"), l), "datalist"),
		h1: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("h1"), l), "h1"),
		h2: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("h2"), l), "h2"),
		h3: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("h3"), l), "h3"),
		br: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("br"), l), "br"),
		hr: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("hr"), l), "hr"),
		pre: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("pre"), l), "pre"),
		label: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("label"), l), "label"),
		ul: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("ul"), l), "ul"),
		li: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("li"), l), "li"),
		iframe: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("iframe"), l), "iframe"),
		b: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("b"), l), "b"),
		img: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("img"), l), "img"),
		style: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("style"), l), "style"),
		search: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("search"), l), "search"),
		p: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("p"), l), "p"),
		canvas: /* @__PURE__ */ __name((...l) => _domKids(document.createElement("canvas"), l), "canvas")
	};
	var _attr = /* @__PURE__ */ __name((k, v) => {
		const o = {};
		o[k] = v;
		return { _attrs: o };
	}, "_attr");
	var attr = {
		title: /* @__PURE__ */ __name((s) => _attr("title", s), "title"),
		value: /* @__PURE__ */ __name((s) => _attr("value", s), "value"),
		type: /* @__PURE__ */ __name((s) => _attr("type", s), "type"),
		tabindex: /* @__PURE__ */ __name((s) => _attr("tabindex", s), "tabindex"),
		src: /* @__PURE__ */ __name((s) => _attr("src", s), "src"),
		placeholder: /* @__PURE__ */ __name((s) => _attr("placeholder", s), "placeholder"),
		href: /* @__PURE__ */ __name((s) => _attr("href", s), "href"),
		checked: /* @__PURE__ */ __name((s) => _attr("checked", s), "checked"),
		selected: /* @__PURE__ */ __name((s) => _attr("selected", s), "selected"),
		id: /* @__PURE__ */ __name((s) => _attr("id", s), "id"),
		datalist: /* @__PURE__ */ __name((s) => _attr("datalist", s), "datalist"),
		rows: /* @__PURE__ */ __name((s) => _attr("rows", s), "rows"),
		target: /* @__PURE__ */ __name((s) => _attr("target", s), "target"),
		rel: /* @__PURE__ */ __name((s) => _attr("rel", s), "rel"),
		required: /* @__PURE__ */ __name((s) => _attr("required", s), "required"),
		multiple: /* @__PURE__ */ __name((s) => _attr("multiple", s), "multiple"),
		download: /* @__PURE__ */ __name((s) => _attr("download", s), "download"),
		disabled: /* @__PURE__ */ __name((s) => _attr("disabled", s), "disabled"),
		draggable: /* @__PURE__ */ __name((s) => _attr("draggable", s), "draggable"),
		rowspan: /* @__PURE__ */ __name((s) => _attr("rowspan", s), "rowspan"),
		colspan: /* @__PURE__ */ __name((s) => _attr("colspan", s), "colspan"),
		for: /* @__PURE__ */ __name((s) => _attr("for", s), "for"),
		role: /* @__PURE__ */ __name((s) => _attr("role", s), "role"),
		arialabel: /* @__PURE__ */ __name((s) => _attr("aria-label", s), "arialabel"),
		arialive: /* @__PURE__ */ __name((s) => _attr("aria-live", s), "arialive"),
		name: /* @__PURE__ */ __name((s) => _attr("name", s), "name"),
		min: /* @__PURE__ */ __name((s) => _attr("min", s), "min"),
		max: /* @__PURE__ */ __name((s) => _attr("max", s), "max"),
		action: /* @__PURE__ */ __name((s) => _attr("action", s), "action"),
		method: /* @__PURE__ */ __name((s) => _attr("method", s), "method"),
		autocomplete: /* @__PURE__ */ __name((s) => _attr("autocomplete", s), "autocomplete"),
		list: /* @__PURE__ */ __name((s) => _attr("list", s), "list"),
		form: /* @__PURE__ */ __name((s) => _attr("form", s), "form"),
		size: /* @__PURE__ */ __name((s) => _attr("size", s), "size")
	};
	var style = /* @__PURE__ */ __name((x) => {
		return { _styles: x };
	}, "style");

	// .js/webmail/api.js
	var Validation;
	(function(Validation2) {
		Validation2[Validation2["ValidationUnknown"] = 0] = "ValidationUnknown";
		Validation2[Validation2["ValidationStrict"] = 1] = "ValidationStrict";
		Validation2[Validation2["ValidationDMARC"] = 2] = "ValidationDMARC";
		Validation2[Validation2["ValidationRelaxed"] = 3] = "ValidationRelaxed";
		Validation2[Validation2["ValidationPass"] = 4] = "ValidationPass";
		Validation2[Validation2["ValidationNeutral"] = 5] = "ValidationNeutral";
		Validation2[Validation2["ValidationTemperror"] = 6] = "ValidationTemperror";
		Validation2[Validation2["ValidationPermerror"] = 7] = "ValidationPermerror";
		Validation2[Validation2["ValidationFail"] = 8] = "ValidationFail";
		Validation2[Validation2["ValidationSoftfail"] = 9] = "ValidationSoftfail";
		Validation2[Validation2["ValidationNone"] = 10] = "ValidationNone";
	})(Validation || (Validation = {}));
	var ThreadMode;
	(function(ThreadMode2) {
		ThreadMode2["ThreadOff"] = "off";
		ThreadMode2["ThreadOn"] = "on";
		ThreadMode2["ThreadUnread"] = "unread";
	})(ThreadMode || (ThreadMode = {}));
	var AttachmentType;
	(function(AttachmentType2) {
		AttachmentType2["AttachmentIndifferent"] = "";
		AttachmentType2["AttachmentNone"] = "none";
		AttachmentType2["AttachmentAny"] = "any";
		AttachmentType2["AttachmentImage"] = "image";
		AttachmentType2["AttachmentPDF"] = "pdf";
		AttachmentType2["AttachmentArchive"] = "archive";
		AttachmentType2["AttachmentSpreadsheet"] = "spreadsheet";
		AttachmentType2["AttachmentDocument"] = "document";
		AttachmentType2["AttachmentPresentation"] = "presentation";
	})(AttachmentType || (AttachmentType = {}));
	var ViewMode;
	(function(ViewMode2) {
		ViewMode2["ModeText"] = "text";
		ViewMode2["ModeHTML"] = "html";
		ViewMode2["ModeHTMLExt"] = "htmlext";
	})(ViewMode || (ViewMode = {}));
	var SecurityResult;
	(function(SecurityResult2) {
		SecurityResult2["SecurityResultError"] = "error";
		SecurityResult2["SecurityResultNo"] = "no";
		SecurityResult2["SecurityResultYes"] = "yes";
		SecurityResult2["SecurityResultUnknown"] = "unknown";
	})(SecurityResult || (SecurityResult = {}));
	var Quoting;
	(function(Quoting2) {
		Quoting2["Default"] = "";
		Quoting2["Bottom"] = "bottom";
		Quoting2["Top"] = "top";
	})(Quoting || (Quoting = {}));
	var structTypes = { "Address": true, "Attachment": true, "ChangeMailboxAdd": true, "ChangeMailboxCounts": true, "ChangeMailboxKeywords": true, "ChangeMailboxRemove": true, "ChangeMailboxRename": true, "ChangeMailboxSpecialUse": true, "ChangeMsgAdd": true, "ChangeMsgFlags": true, "ChangeMsgRemove": true, "ChangeMsgThread": true, "ComposeMessage": true, "Domain": true, "DomainAddressConfig": true, "Envelope": true, "EventStart": true, "EventViewChanges": true, "EventViewErr": true, "EventViewMsgs": true, "EventViewReset": true, "File": true, "Filter": true, "Flags": true, "ForwardAttachments": true, "FromAddressSettings": true, "Mailbox": true, "Message": true, "MessageAddress": true, "MessageEnvelope": true, "MessageItem": true, "NotFilter": true, "Page": true, "ParsedMessage": true, "Part": true, "Query": true, "RecipientSecurity": true, "Request": true, "Ruleset": true, "Settings": true, "SpecialUse": true, "SubmitMessage": true };
	var stringsTypes = { "AttachmentType": true, "CSRFToken": true, "Localpart": true, "Quoting": true, "SecurityResult": true, "ThreadMode": true, "ViewMode": true };
	var intsTypes = { "ModSeq": true, "UID": true, "Validation": true };
	var types = {
		"Request": { "Name": "Request", "Docs": "", "Fields": [{ "Name": "ID", "Docs": "", "Typewords": ["int64"] }, { "Name": "SSEID", "Docs": "", "Typewords": ["int64"] }, { "Name": "ViewID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Cancel", "Docs": "", "Typewords": ["bool"] }, { "Name": "Query", "Docs": "", "Typewords": ["Query"] }, { "Name": "Page", "Docs": "", "Typewords": ["Page"] }] },
		"Query": { "Name": "Query", "Docs": "", "Fields": [{ "Name": "OrderAsc", "Docs": "", "Typewords": ["bool"] }, { "Name": "Threading", "Docs": "", "Typewords": ["ThreadMode"] }, { "Name": "Filter", "Docs": "", "Typewords": ["Filter"] }, { "Name": "NotFilter", "Docs": "", "Typewords": ["NotFilter"] }] },
		"Filter": { "Name": "Filter", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MailboxChildrenIncluded", "Docs": "", "Typewords": ["bool"] }, { "Name": "MailboxName", "Docs": "", "Typewords": ["string"] }, { "Name": "Words", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "From", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Oldest", "Docs": "", "Typewords": ["nullable", "timestamp"] }, { "Name": "Newest", "Docs": "", "Typewords": ["nullable", "timestamp"] }, { "Name": "Subject", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Attachments", "Docs": "", "Typewords": ["AttachmentType"] }, { "Name": "Labels", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Headers", "Docs": "", "Typewords": ["[]", "[]", "string"] }, { "Name": "SizeMin", "Docs": "", "Typewords": ["int64"] }, { "Name": "SizeMax", "Docs": "", "Typewords": ["int64"] }] },
		"NotFilter": { "Name": "NotFilter", "Docs": "", "Fields": [{ "Name": "Words", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "From", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Subject", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Attachments", "Docs": "", "Typewords": ["AttachmentType"] }, { "Name": "Labels", "Docs": "", "Typewords": ["[]", "string"] }] },
		"Page": { "Name": "Page", "Docs": "", "Fields": [{ "Name": "AnchorMessageID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Count", "Docs": "", "Typewords": ["int32"] }, { "Name": "DestMessageID", "Docs": "", "Typewords": ["int64"] }] },
		"MessageItem": { "Name": "MessageItem", "Docs": "", "Fields": [{ "Name": "Message", "Docs": "", "Typewords": ["Message"] }, { "Name": "Envelope", "Docs": "", "Typewords": ["MessageEnvelope"] }, { "Name": "Attachments", "Docs": "", "Typewords": ["[]", "Attachment"] }, { "Name": "IsSigned", "Docs": "", "Typewords": ["bool"] }, { "Name": "IsEncrypted", "Docs": "", "Typewords": ["bool"] }, { "Name": "MatchQuery", "Docs": "", "Typewords": ["bool"] }, { "Name": "MoreHeaders", "Docs": "", "Typewords": ["[]", "[]", "string"] }] },
		"Message": { "Name": "Message", "Docs": "", "Fields": [{ "Name": "ID", "Docs": "", "Typewords": ["int64"] }, { "Name": "UID", "Docs": "", "Typewords": ["UID"] }, { "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "CreateSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "Expunged", "Docs": "", "Typewords": ["bool"] }, { "Name": "IsReject", "Docs": "", "Typewords": ["bool"] }, { "Name": "IsForward", "Docs": "", "Typewords": ["bool"] }, { "Name": "MailboxOrigID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MailboxDestinedID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Received", "Docs": "", "Typewords": ["timestamp"] }, { "Name": "SaveDate", "Docs": "", "Typewords": ["nullable", "timestamp"] }, { "Name": "RemoteIP", "Docs": "", "Typewords": ["string"] }, { "Name": "RemoteIPMasked1", "Docs": "", "Typewords": ["string"] }, { "Name": "RemoteIPMasked2", "Docs": "", "Typewords": ["string"] }, { "Name": "RemoteIPMasked3", "Docs": "", "Typewords": ["string"] }, { "Name": "EHLODomain", "Docs": "", "Typewords": ["string"] }, { "Name": "MailFrom", "Docs": "", "Typewords": ["string"] }, { "Name": "MailFromLocalpart", "Docs": "", "Typewords": ["Localpart"] }, { "Name": "MailFromDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "RcptToLocalpart", "Docs": "", "Typewords": ["Localpart"] }, { "Name": "RcptToDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "MsgFromLocalpart", "Docs": "", "Typewords": ["Localpart"] }, { "Name": "MsgFromDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "MsgFromOrgDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "EHLOValidated", "Docs": "", "Typewords": ["bool"] }, { "Name": "MailFromValidated", "Docs": "", "Typewords": ["bool"] }, { "Name": "MsgFromValidated", "Docs": "", "Typewords": ["bool"] }, { "Name": "EHLOValidation", "Docs": "", "Typewords": ["Validation"] }, { "Name": "MailFromValidation", "Docs": "", "Typewords": ["Validation"] }, { "Name": "MsgFromValidation", "Docs": "", "Typewords": ["Validation"] }, { "Name": "DKIMDomains", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "OrigEHLODomain", "Docs": "", "Typewords": ["string"] }, { "Name": "OrigDKIMDomains", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "MessageID", "Docs": "", "Typewords": ["string"] }, { "Name": "SubjectBase", "Docs": "", "Typewords": ["string"] }, { "Name": "MessageHash", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ThreadID", "Docs": "", "Typewords": ["int64"] }, { "Name": "ThreadParentIDs", "Docs": "", "Typewords": ["[]", "int64"] }, { "Name": "ThreadMissingLink", "Docs": "", "Typewords": ["bool"] }, { "Name": "ThreadMuted", "Docs": "", "Typewords": ["bool"] }, { "Name": "ThreadCollapsed", "Docs": "", "Typewords": ["bool"] }, { "Name": "IsMailingList", "Docs": "", "Typewords": ["bool"] }, { "Name": "DSN", "Docs": "", "Typewords": ["bool"] }, { "Name": "ReceivedTLSVersion", "Docs": "", "Typewords": ["uint16"] }, { "Name": "ReceivedTLSCipherSuite", "Docs": "", "Typewords": ["uint16"] }, { "Name": "ReceivedRequireTLS", "Docs": "", "Typewords": ["bool"] }, { "Name": "Seen", "Docs": "", "Typewords": ["bool"] }, { "Name": "Answered", "Docs": "", "Typewords": ["bool"] }, { "Name": "Flagged", "Docs": "", "Typewords": ["bool"] }, { "Name": "Forwarded", "Docs": "", "Typewords": ["bool"] }, { "Name": "Junk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Notjunk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Deleted", "Docs": "", "Typewords": ["bool"] }, { "Name": "Draft", "Docs": "", "Typewords": ["bool"] }, { "Name": "Phishing", "Docs": "", "Typewords": ["bool"] }, { "Name": "MDNSent", "Docs": "", "Typewords": ["bool"] }, { "Name": "Keywords", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Size", "Docs": "", "Typewords": ["int64"] }, { "Name": "TrainedJunk", "Docs": "", "Typewords": ["nullable", "bool"] }, { "Name": "MsgPrefix", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "Preview", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ParsedBuf", "Docs": "", "Typewords": ["nullable", "string"] }] },
		"MessageEnvelope": { "Name": "MessageEnvelope", "Docs": "", "Fields": [{ "Name": "Date", "Docs": "", "Typewords": ["timestamp"] }, { "Name": "Subject", "Docs": "", "Typewords": ["string"] }, { "Name": "From", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "Sender", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "ReplyTo", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "CC", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "BCC", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "InReplyTo", "Docs": "", "Typewords": ["string"] }, { "Name": "MessageID", "Docs": "", "Typewords": ["string"] }] },
		"MessageAddress": { "Name": "MessageAddress", "Docs": "", "Fields": [{ "Name": "Name", "Docs": "", "Typewords": ["string"] }, { "Name": "User", "Docs": "", "Typewords": ["string"] }, { "Name": "Domain", "Docs": "", "Typewords": ["Domain"] }] },
		"Domain": { "Name": "Domain", "Docs": "", "Fields": [{ "Name": "ASCII", "Docs": "", "Typewords": ["string"] }, { "Name": "Unicode", "Docs": "", "Typewords": ["string"] }] },
		"Attachment": { "Name": "Attachment", "Docs": "", "Fields": [{ "Name": "Path", "Docs": "", "Typewords": ["[]", "int32"] }, { "Name": "Filename", "Docs": "", "Typewords": ["string"] }, { "Name": "Part", "Docs": "", "Typewords": ["Part"] }] },
		"Part": { "Name": "Part", "Docs": "", "Fields": [{ "Name": "BoundaryOffset", "Docs": "", "Typewords": ["int64"] }, { "Name": "HeaderOffset", "Docs": "", "Typewords": ["int64"] }, { "Name": "BodyOffset", "Docs": "", "Typewords": ["int64"] }, { "Name": "EndOffset", "Docs": "", "Typewords": ["int64"] }, { "Name": "RawLineCount", "Docs": "", "Typewords": ["int64"] }, { "Name": "DecodedSize", "Docs": "", "Typewords": ["int64"] }, { "Name": "MediaType", "Docs": "", "Typewords": ["string"] }, { "Name": "MediaSubType", "Docs": "", "Typewords": ["string"] }, { "Name": "ContentTypeParams", "Docs": "", "Typewords": ["{}", "string"] }, { "Name": "ContentID", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentDescription", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentTransferEncoding", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentDisposition", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentMD5", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentLanguage", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "ContentLocation", "Docs": "", "Typewords": ["nullable", "string"] }, { "Name": "Envelope", "Docs": "", "Typewords": ["nullable", "Envelope"] }, { "Name": "Parts", "Docs": "", "Typewords": ["[]", "Part"] }, { "Name": "Message", "Docs": "", "Typewords": ["nullable", "Part"] }] },
		"Envelope": { "Name": "Envelope", "Docs": "", "Fields": [{ "Name": "Date", "Docs": "", "Typewords": ["timestamp"] }, { "Name": "Subject", "Docs": "", "Typewords": ["string"] }, { "Name": "From", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "Sender", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "ReplyTo", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "CC", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "BCC", "Docs": "", "Typewords": ["[]", "Address"] }, { "Name": "InReplyTo", "Docs": "", "Typewords": ["string"] }, { "Name": "MessageID", "Docs": "", "Typewords": ["string"] }] },
		"Address": { "Name": "Address", "Docs": "", "Fields": [{ "Name": "Name", "Docs": "", "Typewords": ["string"] }, { "Name": "User", "Docs": "", "Typewords": ["string"] }, { "Name": "Host", "Docs": "", "Typewords": ["string"] }] },
		"ParsedMessage": { "Name": "ParsedMessage", "Docs": "", "Fields": [{ "Name": "ID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Part", "Docs": "", "Typewords": ["Part"] }, { "Name": "Headers", "Docs": "", "Typewords": ["{}", "[]", "string"] }, { "Name": "ViewMode", "Docs": "", "Typewords": ["ViewMode"] }, { "Name": "Texts", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "HasHTML", "Docs": "", "Typewords": ["bool"] }, { "Name": "ListReplyAddress", "Docs": "", "Typewords": ["nullable", "MessageAddress"] }, { "Name": "TextPaths", "Docs": "", "Typewords": ["[]", "[]", "int32"] }, { "Name": "HTMLPath", "Docs": "", "Typewords": ["[]", "int32"] }] },
		"FromAddressSettings": { "Name": "FromAddressSettings", "Docs": "", "Fields": [{ "Name": "FromAddress", "Docs": "", "Typewords": ["string"] }, { "Name": "ViewMode", "Docs": "", "Typewords": ["ViewMode"] }] },
		"ComposeMessage": { "Name": "ComposeMessage", "Docs": "", "Fields": [{ "Name": "From", "Docs": "", "Typewords": ["string"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Cc", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Bcc", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "ReplyTo", "Docs": "", "Typewords": ["string"] }, { "Name": "Subject", "Docs": "", "Typewords": ["string"] }, { "Name": "TextBody", "Docs": "", "Typewords": ["string"] }, { "Name": "ResponseMessageID", "Docs": "", "Typewords": ["int64"] }, { "Name": "DraftMessageID", "Docs": "", "Typewords": ["int64"] }] },
		"SubmitMessage": { "Name": "SubmitMessage", "Docs": "", "Fields": [{ "Name": "From", "Docs": "", "Typewords": ["string"] }, { "Name": "To", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Cc", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "Bcc", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "ReplyTo", "Docs": "", "Typewords": ["string"] }, { "Name": "Subject", "Docs": "", "Typewords": ["string"] }, { "Name": "TextBody", "Docs": "", "Typewords": ["string"] }, { "Name": "Attachments", "Docs": "", "Typewords": ["[]", "File"] }, { "Name": "ForwardAttachments", "Docs": "", "Typewords": ["ForwardAttachments"] }, { "Name": "IsForward", "Docs": "", "Typewords": ["bool"] }, { "Name": "ResponseMessageID", "Docs": "", "Typewords": ["int64"] }, { "Name": "UserAgent", "Docs": "", "Typewords": ["string"] }, { "Name": "RequireTLS", "Docs": "", "Typewords": ["nullable", "bool"] }, { "Name": "FutureRelease", "Docs": "", "Typewords": ["nullable", "timestamp"] }, { "Name": "ArchiveThread", "Docs": "", "Typewords": ["bool"] }, { "Name": "ArchiveReferenceMailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "DraftMessageID", "Docs": "", "Typewords": ["int64"] }] },
		"File": { "Name": "File", "Docs": "", "Fields": [{ "Name": "Filename", "Docs": "", "Typewords": ["string"] }, { "Name": "DataURI", "Docs": "", "Typewords": ["string"] }] },
		"ForwardAttachments": { "Name": "ForwardAttachments", "Docs": "", "Fields": [{ "Name": "MessageID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Paths", "Docs": "", "Typewords": ["[]", "[]", "int32"] }] },
		"Mailbox": { "Name": "Mailbox", "Docs": "", "Fields": [{ "Name": "ID", "Docs": "", "Typewords": ["int64"] }, { "Name": "CreateSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "Expunged", "Docs": "", "Typewords": ["bool"] }, { "Name": "ParentID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Name", "Docs": "", "Typewords": ["string"] }, { "Name": "UIDValidity", "Docs": "", "Typewords": ["uint32"] }, { "Name": "UIDNext", "Docs": "", "Typewords": ["UID"] }, { "Name": "Archive", "Docs": "", "Typewords": ["bool"] }, { "Name": "Draft", "Docs": "", "Typewords": ["bool"] }, { "Name": "Junk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Sent", "Docs": "", "Typewords": ["bool"] }, { "Name": "Trash", "Docs": "", "Typewords": ["bool"] }, { "Name": "Keywords", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "HaveCounts", "Docs": "", "Typewords": ["bool"] }, { "Name": "Total", "Docs": "", "Typewords": ["int64"] }, { "Name": "Deleted", "Docs": "", "Typewords": ["int64"] }, { "Name": "Unread", "Docs": "", "Typewords": ["int64"] }, { "Name": "Unseen", "Docs": "", "Typewords": ["int64"] }, { "Name": "Size", "Docs": "", "Typewords": ["int64"] }] },
		"RecipientSecurity": { "Name": "RecipientSecurity", "Docs": "", "Fields": [{ "Name": "STARTTLS", "Docs": "", "Typewords": ["SecurityResult"] }, { "Name": "MTASTS", "Docs": "", "Typewords": ["SecurityResult"] }, { "Name": "DNSSEC", "Docs": "", "Typewords": ["SecurityResult"] }, { "Name": "DANE", "Docs": "", "Typewords": ["SecurityResult"] }, { "Name": "RequireTLS", "Docs": "", "Typewords": ["SecurityResult"] }] },
		"Settings": { "Name": "Settings", "Docs": "", "Fields": [{ "Name": "ID", "Docs": "", "Typewords": ["uint8"] }, { "Name": "Signature", "Docs": "", "Typewords": ["string"] }, { "Name": "Quoting", "Docs": "", "Typewords": ["Quoting"] }, { "Name": "ShowAddressSecurity", "Docs": "", "Typewords": ["bool"] }, { "Name": "ShowHTML", "Docs": "", "Typewords": ["bool"] }, { "Name": "NoShowShortcuts", "Docs": "", "Typewords": ["bool"] }, { "Name": "ShowHeaders", "Docs": "", "Typewords": ["[]", "string"] }] },
		"Ruleset": { "Name": "Ruleset", "Docs": "", "Fields": [{ "Name": "SMTPMailFromRegexp", "Docs": "", "Typewords": ["string"] }, { "Name": "MsgFromRegexp", "Docs": "", "Typewords": ["string"] }, { "Name": "VerifiedDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "HeadersRegexp", "Docs": "", "Typewords": ["{}", "string"] }, { "Name": "IsForward", "Docs": "", "Typewords": ["bool"] }, { "Name": "ListAllowDomain", "Docs": "", "Typewords": ["string"] }, { "Name": "AcceptRejectsToMailbox", "Docs": "", "Typewords": ["string"] }, { "Name": "Mailbox", "Docs": "", "Typewords": ["string"] }, { "Name": "Comment", "Docs": "", "Typewords": ["string"] }, { "Name": "VerifiedDNSDomain", "Docs": "", "Typewords": ["Domain"] }, { "Name": "ListAllowDNSDomain", "Docs": "", "Typewords": ["Domain"] }] },
		"EventStart": { "Name": "EventStart", "Docs": "", "Fields": [{ "Name": "SSEID", "Docs": "", "Typewords": ["int64"] }, { "Name": "LoginAddress", "Docs": "", "Typewords": ["MessageAddress"] }, { "Name": "Addresses", "Docs": "", "Typewords": ["[]", "MessageAddress"] }, { "Name": "DomainAddressConfigs", "Docs": "", "Typewords": ["{}", "DomainAddressConfig"] }, { "Name": "MailboxName", "Docs": "", "Typewords": ["string"] }, { "Name": "Mailboxes", "Docs": "", "Typewords": ["[]", "Mailbox"] }, { "Name": "Introbox", "Docs": "", "Typewords": ["string"] }, { "Name": "RejectsMailbox", "Docs": "", "Typewords": ["string"] }, { "Name": "Settings", "Docs": "", "Typewords": ["Settings"] }, { "Name": "AccountPath", "Docs": "", "Typewords": ["string"] }, { "Name": "Version", "Docs": "", "Typewords": ["string"] }] },
		"DomainAddressConfig": { "Name": "DomainAddressConfig", "Docs": "", "Fields": [{ "Name": "LocalpartCatchallSeparators", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "LocalpartCaseSensitive", "Docs": "", "Typewords": ["bool"] }] },
		"EventViewErr": { "Name": "EventViewErr", "Docs": "", "Fields": [{ "Name": "ViewID", "Docs": "", "Typewords": ["int64"] }, { "Name": "RequestID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Err", "Docs": "", "Typewords": ["string"] }] },
		"EventViewReset": { "Name": "EventViewReset", "Docs": "", "Fields": [{ "Name": "ViewID", "Docs": "", "Typewords": ["int64"] }, { "Name": "RequestID", "Docs": "", "Typewords": ["int64"] }] },
		"EventViewMsgs": { "Name": "EventViewMsgs", "Docs": "", "Fields": [{ "Name": "ViewID", "Docs": "", "Typewords": ["int64"] }, { "Name": "RequestID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MessageItems", "Docs": "", "Typewords": ["[]", "[]", "MessageItem"] }, { "Name": "ParsedMessage", "Docs": "", "Typewords": ["nullable", "ParsedMessage"] }, { "Name": "ViewEnd", "Docs": "", "Typewords": ["bool"] }] },
		"EventViewChanges": { "Name": "EventViewChanges", "Docs": "", "Fields": [{ "Name": "ViewID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Changes", "Docs": "", "Typewords": ["[]", "[]", "any"] }] },
		"ChangeMsgAdd": { "Name": "ChangeMsgAdd", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "UID", "Docs": "", "Typewords": ["UID"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "Flags", "Docs": "", "Typewords": ["Flags"] }, { "Name": "Keywords", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "MessageCountIMAP", "Docs": "", "Typewords": ["uint32"] }, { "Name": "Unseen", "Docs": "", "Typewords": ["uint32"] }, { "Name": "MessageItems", "Docs": "", "Typewords": ["[]", "MessageItem"] }] },
		"Flags": { "Name": "Flags", "Docs": "", "Fields": [{ "Name": "Seen", "Docs": "", "Typewords": ["bool"] }, { "Name": "Answered", "Docs": "", "Typewords": ["bool"] }, { "Name": "Flagged", "Docs": "", "Typewords": ["bool"] }, { "Name": "Forwarded", "Docs": "", "Typewords": ["bool"] }, { "Name": "Junk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Notjunk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Deleted", "Docs": "", "Typewords": ["bool"] }, { "Name": "Draft", "Docs": "", "Typewords": ["bool"] }, { "Name": "Phishing", "Docs": "", "Typewords": ["bool"] }, { "Name": "MDNSent", "Docs": "", "Typewords": ["bool"] }] },
		"ChangeMsgRemove": { "Name": "ChangeMsgRemove", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "UIDs", "Docs": "", "Typewords": ["[]", "UID"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "MsgIDs", "Docs": "", "Typewords": ["[]", "int64"] }, { "Name": "UIDNext", "Docs": "", "Typewords": ["UID"] }, { "Name": "MessageCountIMAP", "Docs": "", "Typewords": ["uint32"] }, { "Name": "Unseen", "Docs": "", "Typewords": ["uint32"] }] },
		"ChangeMsgFlags": { "Name": "ChangeMsgFlags", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "UID", "Docs": "", "Typewords": ["UID"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }, { "Name": "Mask", "Docs": "", "Typewords": ["Flags"] }, { "Name": "Flags", "Docs": "", "Typewords": ["Flags"] }, { "Name": "Keywords", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "UIDValidity", "Docs": "", "Typewords": ["uint32"] }, { "Name": "Unseen", "Docs": "", "Typewords": ["uint32"] }] },
		"ChangeMsgThread": { "Name": "ChangeMsgThread", "Docs": "", "Fields": [{ "Name": "MessageIDs", "Docs": "", "Typewords": ["[]", "int64"] }, { "Name": "Muted", "Docs": "", "Typewords": ["bool"] }, { "Name": "Collapsed", "Docs": "", "Typewords": ["bool"] }] },
		"ChangeMailboxRemove": { "Name": "ChangeMailboxRemove", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "Name", "Docs": "", "Typewords": ["string"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }] },
		"ChangeMailboxAdd": { "Name": "ChangeMailboxAdd", "Docs": "", "Fields": [{ "Name": "Mailbox", "Docs": "", "Typewords": ["Mailbox"] }] },
		"ChangeMailboxRename": { "Name": "ChangeMailboxRename", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "OldName", "Docs": "", "Typewords": ["string"] }, { "Name": "NewName", "Docs": "", "Typewords": ["string"] }, { "Name": "Flags", "Docs": "", "Typewords": ["[]", "string"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }] },
		"ChangeMailboxCounts": { "Name": "ChangeMailboxCounts", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MailboxName", "Docs": "", "Typewords": ["string"] }, { "Name": "Total", "Docs": "", "Typewords": ["int64"] }, { "Name": "Deleted", "Docs": "", "Typewords": ["int64"] }, { "Name": "Unread", "Docs": "", "Typewords": ["int64"] }, { "Name": "Unseen", "Docs": "", "Typewords": ["int64"] }, { "Name": "Size", "Docs": "", "Typewords": ["int64"] }] },
		"ChangeMailboxSpecialUse": { "Name": "ChangeMailboxSpecialUse", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MailboxName", "Docs": "", "Typewords": ["string"] }, { "Name": "SpecialUse", "Docs": "", "Typewords": ["SpecialUse"] }, { "Name": "ModSeq", "Docs": "", "Typewords": ["ModSeq"] }] },
		"SpecialUse": { "Name": "SpecialUse", "Docs": "", "Fields": [{ "Name": "Archive", "Docs": "", "Typewords": ["bool"] }, { "Name": "Draft", "Docs": "", "Typewords": ["bool"] }, { "Name": "Junk", "Docs": "", "Typewords": ["bool"] }, { "Name": "Sent", "Docs": "", "Typewords": ["bool"] }, { "Name": "Trash", "Docs": "", "Typewords": ["bool"] }] },
		"ChangeMailboxKeywords": { "Name": "ChangeMailboxKeywords", "Docs": "", "Fields": [{ "Name": "MailboxID", "Docs": "", "Typewords": ["int64"] }, { "Name": "MailboxName", "Docs": "", "Typewords": ["string"] }, { "Name": "Keywords", "Docs": "", "Typewords": ["[]", "string"] }] },
		"UID": { "Name": "UID", "Docs": "", "Values": null },
		"ModSeq": { "Name": "ModSeq", "Docs": "", "Values": null },
		"Validation": { "Name": "Validation", "Docs": "", "Values": [{ "Name": "ValidationUnknown", "Value": 0, "Docs": "" }, { "Name": "ValidationStrict", "Value": 1, "Docs": "" }, { "Name": "ValidationDMARC", "Value": 2, "Docs": "" }, { "Name": "ValidationRelaxed", "Value": 3, "Docs": "" }, { "Name": "ValidationPass", "Value": 4, "Docs": "" }, { "Name": "ValidationNeutral", "Value": 5, "Docs": "" }, { "Name": "ValidationTemperror", "Value": 6, "Docs": "" }, { "Name": "ValidationPermerror", "Value": 7, "Docs": "" }, { "Name": "ValidationFail", "Value": 8, "Docs": "" }, { "Name": "ValidationSoftfail", "Value": 9, "Docs": "" }, { "Name": "ValidationNone", "Value": 10, "Docs": "" }] },
		"CSRFToken": { "Name": "CSRFToken", "Docs": "", "Values": null },
		"ThreadMode": { "Name": "ThreadMode", "Docs": "", "Values": [{ "Name": "ThreadOff", "Value": "off", "Docs": "" }, { "Name": "ThreadOn", "Value": "on", "Docs": "" }, { "Name": "ThreadUnread", "Value": "unread", "Docs": "" }] },
		"AttachmentType": { "Name": "AttachmentType", "Docs": "", "Values": [{ "Name": "AttachmentIndifferent", "Value": "", "Docs": "" }, { "Name": "AttachmentNone", "Value": "none", "Docs": "" }, { "Name": "AttachmentAny", "Value": "any", "Docs": "" }, { "Name": "AttachmentImage", "Value": "image", "Docs": "" }, { "Name": "AttachmentPDF", "Value": "pdf", "Docs": "" }, { "Name": "AttachmentArchive", "Value": "archive", "Docs": "" }, { "Name": "AttachmentSpreadsheet", "Value": "spreadsheet", "Docs": "" }, { "Name": "AttachmentDocument", "Value": "document", "Docs": "" }, { "Name": "AttachmentPresentation", "Value": "presentation", "Docs": "" }] },
		"Localpart": { "Name": "Localpart", "Docs": "", "Values": null },
		"ViewMode": { "Name": "ViewMode", "Docs": "", "Values": [{ "Name": "ModeText", "Value": "text", "Docs": "" }, { "Name": "ModeHTML", "Value": "html", "Docs": "" }, { "Name": "ModeHTMLExt", "Value": "htmlext", "Docs": "" }] },
		"SecurityResult": { "Name": "SecurityResult", "Docs": "", "Values": [{ "Name": "SecurityResultError", "Value": "error", "Docs": "" }, { "Name": "SecurityResultNo", "Value": "no", "Docs": "" }, { "Name": "SecurityResultYes", "Value": "yes", "Docs": "" }, { "Name": "SecurityResultUnknown", "Value": "unknown", "Docs": "" }] },
		"Quoting": { "Name": "Quoting", "Docs": "", "Values": [{ "Name": "Default", "Value": "", "Docs": "" }, { "Name": "Bottom", "Value": "bottom", "Docs": "" }, { "Name": "Top", "Value": "top", "Docs": "" }] }
	};
	var parser = {
		Request: /* @__PURE__ */ __name((v) => parse("Request", v), "Request"),
		Query: /* @__PURE__ */ __name((v) => parse("Query", v), "Query"),
		Filter: /* @__PURE__ */ __name((v) => parse("Filter", v), "Filter"),
		NotFilter: /* @__PURE__ */ __name((v) => parse("NotFilter", v), "NotFilter"),
		Page: /* @__PURE__ */ __name((v) => parse("Page", v), "Page"),
		MessageItem: /* @__PURE__ */ __name((v) => parse("MessageItem", v), "MessageItem"),
		Message: /* @__PURE__ */ __name((v) => parse("Message", v), "Message"),
		MessageEnvelope: /* @__PURE__ */ __name((v) => parse("MessageEnvelope", v), "MessageEnvelope"),
		MessageAddress: /* @__PURE__ */ __name((v) => parse("MessageAddress", v), "MessageAddress"),
		Domain: /* @__PURE__ */ __name((v) => parse("Domain", v), "Domain"),
		Attachment: /* @__PURE__ */ __name((v) => parse("Attachment", v), "Attachment"),
		Part: /* @__PURE__ */ __name((v) => parse("Part", v), "Part"),
		Envelope: /* @__PURE__ */ __name((v) => parse("Envelope", v), "Envelope"),
		Address: /* @__PURE__ */ __name((v) => parse("Address", v), "Address"),
		ParsedMessage: /* @__PURE__ */ __name((v) => parse("ParsedMessage", v), "ParsedMessage"),
		FromAddressSettings: /* @__PURE__ */ __name((v) => parse("FromAddressSettings", v), "FromAddressSettings"),
		ComposeMessage: /* @__PURE__ */ __name((v) => parse("ComposeMessage", v), "ComposeMessage"),
		SubmitMessage: /* @__PURE__ */ __name((v) => parse("SubmitMessage", v), "SubmitMessage"),
		File: /* @__PURE__ */ __name((v) => parse("File", v), "File"),
		ForwardAttachments: /* @__PURE__ */ __name((v) => parse("ForwardAttachments", v), "ForwardAttachments"),
		Mailbox: /* @__PURE__ */ __name((v) => parse("Mailbox", v), "Mailbox"),
		RecipientSecurity: /* @__PURE__ */ __name((v) => parse("RecipientSecurity", v), "RecipientSecurity"),
		Settings: /* @__PURE__ */ __name((v) => parse("Settings", v), "Settings"),
		Ruleset: /* @__PURE__ */ __name((v) => parse("Ruleset", v), "Ruleset"),
		EventStart: /* @__PURE__ */ __name((v) => parse("EventStart", v), "EventStart"),
		DomainAddressConfig: /* @__PURE__ */ __name((v) => parse("DomainAddressConfig", v), "DomainAddressConfig"),
		EventViewErr: /* @__PURE__ */ __name((v) => parse("EventViewErr", v), "EventViewErr"),
		EventViewReset: /* @__PURE__ */ __name((v) => parse("EventViewReset", v), "EventViewReset"),
		EventViewMsgs: /* @__PURE__ */ __name((v) => parse("EventViewMsgs", v), "EventViewMsgs"),
		EventViewChanges: /* @__PURE__ */ __name((v) => parse("EventViewChanges", v), "EventViewChanges"),
		ChangeMsgAdd: /* @__PURE__ */ __name((v) => parse("ChangeMsgAdd", v), "ChangeMsgAdd"),
		Flags: /* @__PURE__ */ __name((v) => parse("Flags", v), "Flags"),
		ChangeMsgRemove: /* @__PURE__ */ __name((v) => parse("ChangeMsgRemove", v), "ChangeMsgRemove"),
		ChangeMsgFlags: /* @__PURE__ */ __name((v) => parse("ChangeMsgFlags", v), "ChangeMsgFlags"),
		ChangeMsgThread: /* @__PURE__ */ __name((v) => parse("ChangeMsgThread", v), "ChangeMsgThread"),
		ChangeMailboxRemove: /* @__PURE__ */ __name((v) => parse("ChangeMailboxRemove", v), "ChangeMailboxRemove"),
		ChangeMailboxAdd: /* @__PURE__ */ __name((v) => parse("ChangeMailboxAdd", v), "ChangeMailboxAdd"),
		ChangeMailboxRename: /* @__PURE__ */ __name((v) => parse("ChangeMailboxRename", v), "ChangeMailboxRename"),
		ChangeMailboxCounts: /* @__PURE__ */ __name((v) => parse("ChangeMailboxCounts", v), "ChangeMailboxCounts"),
		ChangeMailboxSpecialUse: /* @__PURE__ */ __name((v) => parse("ChangeMailboxSpecialUse", v), "ChangeMailboxSpecialUse"),
		SpecialUse: /* @__PURE__ */ __name((v) => parse("SpecialUse", v), "SpecialUse"),
		ChangeMailboxKeywords: /* @__PURE__ */ __name((v) => parse("ChangeMailboxKeywords", v), "ChangeMailboxKeywords"),
		UID: /* @__PURE__ */ __name((v) => parse("UID", v), "UID"),
		ModSeq: /* @__PURE__ */ __name((v) => parse("ModSeq", v), "ModSeq"),
		Validation: /* @__PURE__ */ __name((v) => parse("Validation", v), "Validation"),
		CSRFToken: /* @__PURE__ */ __name((v) => parse("CSRFToken", v), "CSRFToken"),
		ThreadMode: /* @__PURE__ */ __name((v) => parse("ThreadMode", v), "ThreadMode"),
		AttachmentType: /* @__PURE__ */ __name((v) => parse("AttachmentType", v), "AttachmentType"),
		Localpart: /* @__PURE__ */ __name((v) => parse("Localpart", v), "Localpart"),
		ViewMode: /* @__PURE__ */ __name((v) => parse("ViewMode", v), "ViewMode"),
		SecurityResult: /* @__PURE__ */ __name((v) => parse("SecurityResult", v), "SecurityResult"),
		Quoting: /* @__PURE__ */ __name((v) => parse("Quoting", v), "Quoting")
	};
	var defaultOptions = { slicesNullable: true, mapsNullable: true, nullableOptional: true };
	var defaultBaseURL = (function() {
		let p = location.pathname;
		if (p && p[p.length - 1] !== "/") {
			let l = location.pathname.split("/");
			l = l.slice(0, l.length - 1);
			p = "/" + l.join("/") + "/";
		}
		return location.protocol + "//" + location.host + p + "api/";
	})();
	var verifyArg = /* @__PURE__ */ __name((path, v, typewords, toJS, allowUnknownKeys, types2, opts) => {
		return new verifier(types2, toJS, allowUnknownKeys, opts).verify(path, v, typewords);
	}, "verifyArg");
	var parse = /* @__PURE__ */ __name((name, v) => verifyArg(name, v, [name], true, false, types, defaultOptions), "parse");
	var verifier = class {
		static {
			__name(this, "verifier");
		}
		types;
		toJS;
		allowUnknownKeys;
		opts;
		constructor(types2, toJS, allowUnknownKeys, opts) {
			this.types = types2;
			this.toJS = toJS;
			this.allowUnknownKeys = allowUnknownKeys;
			this.opts = opts;
		}
		verify(path, v, typewords) {
			typewords = typewords.slice(0);
			const ww = typewords.shift();
			const error = /* @__PURE__ */ __name((msg) => {
				if (path != "") {
					msg = path + ": " + msg;
				}
				throw new Error(msg);
			}, "error");
			if (typeof ww !== "string") {
				error("bad typewords");
				return;
			}
			const w = ww;
			const ensure = /* @__PURE__ */ __name((ok, expect) => {
				if (!ok) {
					error("got " + JSON.stringify(v) + ", expected " + expect);
				}
				return v;
			}, "ensure");
			switch (w) {
				case "nullable":
					if (v === null || v === void 0 && this.opts.nullableOptional) {
						return v;
					}
					return this.verify(path, v, typewords);
				case "[]":
					if (v === null && this.opts.slicesNullable || v === void 0 && this.opts.slicesNullable && this.opts.nullableOptional) {
						return v;
					}
					ensure(Array.isArray(v), "array");
					return v.map((e, i) => this.verify(path + "[" + i + "]", e, typewords));
				case "{}":
					if (v === null && this.opts.mapsNullable || v === void 0 && this.opts.mapsNullable && this.opts.nullableOptional) {
						return v;
					}
					ensure(v !== null || typeof v === "object", "object");
					const r = {};
					for (const k in v) {
						r[k] = this.verify(path + "." + k, v[k], typewords);
					}
					return r;
			}
			ensure(typewords.length == 0, "empty typewords");
			const t = typeof v;
			switch (w) {
				case "any":
					return v;
				case "bool":
					ensure(t === "boolean", "bool");
					return v;
				case "int8":
				case "uint8":
				case "int16":
				case "uint16":
				case "int32":
				case "uint32":
				case "int64":
				case "uint64":
					ensure(t === "number" && Number.isInteger(v), "integer");
					return v;
				case "float32":
				case "float64":
					ensure(t === "number", "float");
					return v;
				case "int64s":
				case "uint64s":
					ensure(t === "number" && Number.isInteger(v) || t === "string", "integer fitting in float without precision loss, or string");
					return "" + v;
				case "string":
					ensure(t === "string", "string");
					return v;
				case "timestamp":
					if (this.toJS) {
						ensure(t === "string", "string, with timestamp");
						const d = new Date(v);
						if (d instanceof Date && !isNaN(d.getTime())) {
							return d;
						}
						error("invalid date " + v);
					} else {
						ensure(t === "object" && v !== null, "non-null object");
						ensure(v.__proto__ === Date.prototype, "Date");
						return v.toISOString();
					}
			}
			const nt = this.types[w];
			if (!nt) {
				error("unknown type " + w);
			}
			if (v === null) {
				error("bad value " + v + " for named type " + w);
			}
			if (structTypes[nt.Name]) {
				const t2 = nt;
				if (typeof v !== "object") {
					error("bad value " + v + " for struct " + w);
				}
				const r = {};
				for (const f of t2.Fields) {
					r[f.Name] = this.verify(path + "." + f.Name, v[f.Name], f.Typewords);
				}
				if (!this.allowUnknownKeys) {
					const known = {};
					for (const f of t2.Fields) {
						known[f.Name] = true;
					}
					Object.keys(v).forEach((k) => {
						if (!known[k]) {
							error("unknown key " + k + " for struct " + w);
						}
					});
				}
				return r;
			} else if (stringsTypes[nt.Name]) {
				const t2 = nt;
				if (typeof v !== "string") {
					error("mistyped value " + v + " for named strings " + t2.Name);
				}
				if (!t2.Values || t2.Values.length === 0) {
					return v;
				}
				for (const sv of t2.Values) {
					if (sv.Value === v) {
						return v;
					}
				}
				error("unknown value " + v + " for named strings " + t2.Name);
			} else if (intsTypes[nt.Name]) {
				const t2 = nt;
				if (typeof v !== "number" || !Number.isInteger(v)) {
					error("mistyped value " + v + " for named ints " + t2.Name);
				}
				if (!t2.Values || t2.Values.length === 0) {
					return v;
				}
				for (const sv of t2.Values) {
					if (sv.Value === v) {
						return v;
					}
				}
				error("unknown value " + v + " for named ints " + t2.Name);
			} else {
				throw new Error("unexpected named type " + nt);
			}
		}
	};

	// .js/webmail/i18n.js
	var langKey = "lang-preference";
	var ru = {
		"Archive": "\u0412 \u0430\u0440\u0445\u0438\u0432",
		"Trash": "\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
		"Delete": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
		"More": "\u0415\u0449\u0451",
		"Reply": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C",
		"Reply all": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432\u0441\u0435\u043C",
		"Forward": "\u041F\u0435\u0440\u0435\u0441\u043B\u0430\u0442\u044C",
		"Edit": "\u041F\u0440\u0430\u0432\u0438\u0442\u044C",
		"Junk": "\u0421\u043F\u0430\u043C",
		"Print": "\u041F\u0435\u0447\u0430\u0442\u044C",
		"Close": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
		"Cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
		"Save": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
		"Send": "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
		"Help": "\u0421\u043F\u0440\u0430\u0432\u043A\u0430",
		"Settings": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
		"Logout": "\u0412\u044B\u0439\u0442\u0438",
		"Login": "\u0412\u043E\u0439\u0442\u0438",
		"Tooltip": "\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438",
		"Undo": "\u041E\u0442\u043C\u0435\u043D\u0438\u0442\u044C",
		"Register": "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
		"Unregister": "\u0421\u043D\u044F\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044E",
		"To": "\u041A\u043E\u043C\u0443",
		"Cc": "\u041A\u043E\u043F\u0438\u044F",
		"Bcc": "\u0421\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u043E\u043F\u0438\u044F",
		"Reply-To": "\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441",
		"Custom From": "\u0421\u0432\u043E\u0439 \u0430\u0434\u0440\u0435\u0441",
		"Now": "\u0421\u0435\u0439\u0447\u0430\u0441",
		"Sent": "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435",
		"Draft": "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0438",
		"Create": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C",
		"Rename": "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u0442\u044C",
		"Search": "\u041F\u043E\u0438\u0441\u043A",
		"Auto": "\u0410\u0432\u0442\u043E",
		"Bottom": "\u0421\u043D\u0438\u0437\u0443",
		"Top": "\u0421\u0432\u0435\u0440\u0445\u0443",
		"Signature": "\u041F\u043E\u0434\u043F\u0438\u0441\u044C",
		"Global": "\u041E\u0431\u0449\u0435\u0435",
		"Mailbox": "\u041F\u0430\u043F\u043A\u0430",
		"Message list": "\u0421\u043F\u0438\u0441\u043E\u043A \u043F\u0438\u0441\u0435\u043C",
		"Compose": "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C",
		"Message": "\u041F\u0438\u0441\u044C\u043C\u043E",
		"Attachments": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
		"HTML": "HTML",
		"Text": "\u0422\u0435\u043A\u0441\u0442",
		"Label": "\u041C\u0435\u0442\u043A\u0430",
		"Password": "\u041F\u0430\u0440\u043E\u043B\u044C",
		"Email address": "\u0410\u0434\u0440\u0435\u0441 \u043F\u043E\u0447\u0442\u044B",
		"Light or dark theme": "\u0421\u0432\u0435\u0442\u043B\u0430\u044F \u0438\u043B\u0438 \u0442\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
		"Dark theme": "\u0422\u0451\u043C\u043D\u0430\u044F \u0442\u0435\u043C\u0430",
		"Follow the browser language": "\u041A\u0430\u043A \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435",
		"English": "\u0410\u043D\u0433\u043B\u0438\u0439\u0441\u043A\u0438\u0439",
		"Russian": "\u0420\u0443\u0441\u0441\u043A\u0438\u0439",
		"From:": "\u041E\u0442:",
		"To:": "\u041A\u043E\u043C\u0443:",
		"Cc:": "\u041A\u043E\u043F\u0438\u044F:",
		"Bcc:": "\u0421\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u043E\u043F\u0438\u044F:",
		"Reply-To:": "\u041E\u0431\u0440\u0430\u0442\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441:",
		"Subject:": "\u0422\u0435\u043C\u0430:",
		"Date:": "\u0414\u0430\u0442\u0430:",
		"y": "\u0433",
		"mo": "\u043C\u0435\u0441",
		"d": "\u0434",
		"h": "\u0447",
		"min": "\u043C\u0438\u043D",
		"<1min": "<1 \u043C\u0438\u043D",
		"Label: ": "\u041C\u0435\u0442\u043A\u0430: ",
		"Date header in message: ": "\u0414\u0430\u0442\u0430 \u0432 \u043F\u0438\u0441\u044C\u043C\u0435: ",
		"(missing/invalid)": "(\u043D\u0435\u0442 \u0438\u043B\u0438 \u043D\u0435\u0432\u0435\u0440\u043D\u0430\u044F)",
		"Mailto links": "\u0421\u0441\u044B\u043B\u043A\u0438 mailto",
		"No active elements with tooltips found.": "\u041D\u0435\u0442 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u0441 \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430\u043C\u0438.",
		"Can only compose one message at a time.": "\u041E\u0434\u043D\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u043E \u043C\u043E\u0436\u043D\u043E \u043F\u0438\u0441\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u0434\u043D\u043E \u043F\u0438\u0441\u044C\u043C\u043E.",
		"Saving draft": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0430",
		"no designated drafts mailbox": "\u043F\u0430\u043F\u043A\u0430 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u043E\u0432 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0430",
		"Unsaved changes": "\u041D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
		"Keep editing.": "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u043A\u0443.",
		"The message has unsaved changes. What would you like to do?": "\u0412 \u043F\u0438\u0441\u044C\u043C\u0435 \u0435\u0441\u0442\u044C \u043D\u0435\u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F. \u0427\u0442\u043E \u0441\u0434\u0435\u043B\u0430\u0442\u044C?",
		"Discard changes": "\u041E\u0442\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F",
		"Remove draft": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A",
		"Save draft": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A",
		"Removing draft": "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0430",
		"Sending email": "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u043F\u0438\u0441\u044C\u043C\u0430",
		"Sending email and archive": "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0438 \u0430\u0440\u0445\u0438\u0432",
		"Jane <jane@example.org>": "\u0418\u0432\u0430\u043D <ivan@example.org>",
		"subject...": "\u0442\u0435\u043C\u0430...",
		"Remove address.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0430\u0434\u0440\u0435\u0441.",
		"Save draft message.": "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A.",
		"Close window, saving draft message if body has changed or a draft was saved earlier.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043E\u043A\u043D\u043E. \u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0441\u044F, \u0435\u0441\u043B\u0438 \u0442\u0435\u043A\u0441\u0442 \u043C\u0435\u043D\u044F\u043B\u0441\u044F \u0438\u043B\u0438 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0443\u0436\u0435 \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u043B\u0438.",
		"Set custom From address/name.": "\u0423\u043A\u0430\u0437\u0430\u0442\u044C \u0441\u0432\u043E\u0439 \u0430\u0434\u0440\u0435\u0441 \u0438 \u0438\u043C\u044F \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044F.",
		"Forward attachments: ": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F \u043F\u0435\u0440\u0435\u0441\u044B\u043B\u043A\u0438: ",
		" (Toggle all)": " (\u0432\u0441\u0435)",
		"Message mentions attachments, but no files are attached.": "\u0412 \u043F\u0438\u0441\u044C\u043C\u0435 \u0443\u043F\u043E\u043C\u0438\u043D\u0430\u044E\u0442\u0441\u044F \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u043D\u043E \u0444\u0430\u0439\u043B\u044B \u043D\u0435 \u043F\u0440\u0438\u043A\u0440\u0435\u043F\u043B\u0435\u043D\u044B.",
		"Attachments ": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F ",
		"TLS ": "TLS ",
		"With RequireTLS": "\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u044C TLS",
		"Fallback to insecure": "\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0431\u0435\u0437 \u0437\u0430\u0449\u0438\u0442\u044B",
		"Start of next day": "\u041D\u0430\u0447\u0430\u043B\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0434\u043D\u044F",
		"+1 hour": "+1 \u0447\u0430\u0441",
		"+1 day": "+1 \u0434\u0435\u043D\u044C",
		" in local timezone ": " \u0432 \u043C\u0435\u0441\u0442\u043D\u043E\u043C \u0447\u0430\u0441\u043E\u0432\u043E\u043C \u043F\u043E\u044F\u0441\u0435 ",
		"Send and archive": "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0438 \u0432 \u0430\u0440\u0445\u0438\u0432",
		"only messages in draft mailbox can be edited": "\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0438\u0441\u044C\u043C\u0430 \u0432 \u043F\u0430\u043F\u043A\u0435 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u043E\u0432",
		"Looking up referenced message": "\u041F\u043E\u0438\u0441\u043A \u0438\u0441\u0445\u043E\u0434\u043D\u043E\u0433\u043E \u043F\u0438\u0441\u044C\u043C\u0430",
		"Add/remove this label to the message(s), leaving other labels unchanged.": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043B\u0438 \u0441\u043D\u044F\u0442\u044C \u044D\u0442\u0443 \u043C\u0435\u0442\u043A\u0443, \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043D\u0435 \u043C\u0435\u043D\u044F\u0442\u044C.",
		"Adding label": "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043C\u0435\u0442\u043A\u0438",
		"Removing label": "\u0421\u043D\u044F\u0442\u0438\u0435 \u043C\u0435\u0442\u043A\u0438",
		"Adding new label": "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043D\u043E\u0432\u043E\u0439 \u043C\u0435\u0442\u043A\u0438",
		"Add new label": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043C\u0435\u0442\u043A\u0443",
		"Add this label to the message(s), leaving other labels unchanged.": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u044D\u0442\u0443 \u043C\u0435\u0442\u043A\u0443, \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u043D\u0435 \u043C\u0435\u043D\u044F\u0442\u044C.",
		"Moving to mailbox": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0432 \u043F\u0430\u043F\u043A\u0443",
		"Checking rulesets": "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0440\u0430\u0432\u0438\u043B",
		"Remove rule?": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E?",
		"Close without removing rule.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0438 \u043D\u0435 \u0443\u0434\u0430\u043B\u044F\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E.",
		"Would you like to remove the server-side rule that automatically delivers messages from ": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0441\u0430\u043C\u043E \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442 \u043F\u0438\u0441\u044C\u043C\u0430 \u043E\u0442 ",
		' to mailbox "': " \u0432 \u043F\u0430\u043F\u043A\u0443 \xAB",
		"No, and don't ask again for ": "\u041D\u0435\u0442, \u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u0434\u043B\u044F ",
		"Store ruleset response": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043E\u0442\u0432\u0435\u0442\u0430 \u043E \u043F\u0440\u0430\u0432\u0438\u043B\u0435",
		"No, and don't ask again when moving messages out of \"": "\u041D\u0435\u0442, \u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0438 \u0438\u0437 \xAB",
		"Not now": "\u041D\u0435 \u0441\u0435\u0439\u0447\u0430\u0441",
		"Yes, remove rule": "\u0414\u0430, \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
		"Remove ruleset": "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
		"Add rule?": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E?",
		"Close without adding rule.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0438 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E.",
		"Would you like to create a server-side ruleset that automatically delivers future messages from ": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0441\u0435\u0440\u0432\u0435\u0440\u043D\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u0434\u0430\u043B\u044C\u0448\u0435 \u0441\u0430\u043C\u043E \u0431\u0443\u0434\u0435\u0442 \u0440\u0430\u0441\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0430 \u043E\u0442 ",
		"No, and don't ask again when moving messages to \"": "\u041D\u0435\u0442, \u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u043D\u0435 \u0441\u043F\u0440\u0430\u0448\u0438\u0432\u0430\u0442\u044C \u043F\u0440\u0438 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0438 \u0432 \xAB",
		"Yes, add rule": "\u0414\u0430, \u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
		"Add ruleset": "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
		"You are in the CC header": "\u0412\u044B \u0432 \u043F\u043E\u043B\u0435 \u043A\u043E\u043F\u0438\u0438",
		"You are in the BCC header": "\u0412\u044B \u0432 \u043F\u043E\u043B\u0435 \u0441\u043A\u0440\u044B\u0442\u043E\u0439 \u043A\u043E\u043F\u0438\u0438",
		"You are not in any To, From, CC, BCC header. Could message to a mailing list or Bcc without Bcc message header.": "\u0412\u0430\u0441 \u043D\u0435\u0442 \u0432 \u043F\u043E\u043B\u044F\u0445 \u041A\u043E\u043C\u0443, \u041E\u0442, \u041A\u043E\u043F\u0438\u044F \u0438 \u0421\u043A\u0440\u044B\u0442\u0430\u044F. \u042D\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0430 \u0438\u043B\u0438 \u0441\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u043E\u043F\u0438\u044F \u0431\u0435\u0437 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430.",
		"Same Message-ID.": "\u0422\u043E\u0442 \u0436\u0435 \u0438\u0434\u0435\u043D\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u043E\u0440 \u043F\u0438\u0441\u044C\u043C\u0430.",
		"Immediate parent message is missing.": "\u041F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442.",
		"missing mailbox for message in thread": "\u0443 \u043F\u0438\u0441\u044C\u043C\u0430 \u0432 \u0446\u0435\u043F\u043E\u0447\u043A\u0435 \u043D\u0435\u0442 \u043F\u0430\u043F\u043A\u0438",
		"addressed: ": "\u043A\u043E\u043C\u0443: ",
		"Saving thread expand/collapse": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0441\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0439 \u0446\u0435\u043F\u043E\u0447\u043A\u0438",
		"Expand thread.": "\u0420\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443.",
		"Saving thread expanded": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u043E\u0439 \u0446\u0435\u043F\u043E\u0447\u043A\u0438",
		"Collapse thread.": "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443.",
		"Remove flag": "\u0421\u043D\u044F\u0442\u044C \u0444\u043B\u0430\u0436\u043E\u043A",
		"Flag message": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0444\u043B\u0430\u0436\u043A\u043E\u043C",
		"Remove flag.": "\u0421\u043D\u044F\u0442\u044C \u0444\u043B\u0430\u0436\u043E\u043A.",
		"Flag message.": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u0444\u043B\u0430\u0436\u043A\u043E\u043C.",
		"Removing flag": "\u0421\u043D\u044F\u0442\u0438\u0435 \u0444\u043B\u0430\u0436\u043A\u0430",
		"(no subject)": "(\u0431\u0435\u0437 \u0442\u0435\u043C\u044B)",
		"Move to the Archive mailbox.": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432 \u0430\u0440\u0445\u0438\u0432.",
		"No mailbox configured for archiving yet.": "\u041F\u0430\u043F\u043A\u0430 \u0430\u0440\u0445\u0438\u0432\u0430 \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0430.",
		"Moving to archive mailbox": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0432 \u0430\u0440\u0445\u0438\u0432",
		"Permanently delete message.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430.",
		"Are you sure you want to permanently delete?": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430?",
		"Permanently deleting messages": "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u0438\u0441\u0435\u043C",
		"Move to the Trash mailbox.": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443.",
		"No mailbox configured for trash yet.": "\u041F\u0430\u043F\u043A\u0430 \u043A\u043E\u0440\u0437\u0438\u043D\u044B \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0430.",
		"Moving to trash mailbox": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
		"Part not found.": "\u0427\u0430\u0441\u0442\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.",
		"Saving view mode settings for address": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u0432\u0438\u0434\u0430 \u0434\u043B\u044F \u0430\u0434\u0440\u0435\u0441\u0430",
		"MIME internals": "\u0421\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 MIME",
		"Close internals.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435.",
		"Mime structure": "\u0421\u0442\u0440\u0443\u043A\u0442\u0443\u0440\u0430 MIME",
		"Buttons and headers for message": "\u041A\u043D\u043E\u043F\u043A\u0438 \u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438 \u043F\u0438\u0441\u044C\u043C\u0430",
		"Message body": "\u0422\u0435\u043A\u0441\u0442 \u043F\u0438\u0441\u044C\u043C\u0430",
		"Reply to list": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432 \u0441\u043F\u0438\u0441\u043E\u043A",
		"Compose a reply to this mailing list.": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432 \u044D\u0442\u043E\u0442 \u0441\u043F\u0438\u0441\u043E\u043A \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438.",
		"Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages.": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u0432 \u0441\u043F\u0430\u043C. \u041F\u0438\u0441\u044C\u043C\u043E \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u043E\u0446\u0435\u043D\u043A\u0435 \u043D\u043E\u0432\u044B\u0445 \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0445.",
		"Move to...": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C\u2026",
		"Labels...": "\u041C\u0435\u0442\u043A\u0438\u2026",
		"Print message, opens in new tab and opens print dialog.": "\u041F\u0435\u0447\u0430\u0442\u044C. \u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u043D\u043E\u0432\u0430\u044F \u0432\u043A\u043B\u0430\u0434\u043A\u0430 \u0438 \u043E\u043A\u043D\u043E \u043F\u0435\u0447\u0430\u0442\u0438.",
		"Mark Not Junk": "\u041D\u0435 \u0441\u043F\u0430\u043C",
		"Mark as not junk, causing this message to be used in spam classification of new incoming messages.": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u043D\u0435 \u0441\u043F\u0430\u043C. \u041F\u0438\u0441\u044C\u043C\u043E \u0431\u0443\u0434\u0435\u0442 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u0440\u0438 \u043E\u0446\u0435\u043D\u043A\u0435 \u043D\u043E\u0432\u044B\u0445 \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0445.",
		"Mark Read": "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E",
		"Mark Unread": "\u041D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043E",
		"Mute thread": "\u0417\u0430\u0433\u043B\u0443\u0448\u0438\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443",
		"Unmute thread": "\u0421\u043D\u044F\u0442\u044C \u0437\u0430\u0433\u043B\u0443\u0448\u043A\u0443",
		"Open in new tab": "\u0412 \u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435",
		"Download raw original message": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B",
		"Export as ...": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u2026",
		"Export as...": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442\u2026",
		"Show raw original message in new tab": "\u041E\u0440\u0438\u0433\u0438\u043D\u0430\u043B \u0432 \u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435",
		"Show currently displayed part as decoded text": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u044D\u0442\u0443 \u0447\u0430\u0441\u0442\u044C \u043A\u0430\u043A \u0442\u0435\u043A\u0441\u0442",
		"Show internals in popup": "\u0421\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435",
		"Continue editing this draft message.": "\u041F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A.",
		"Compose a reply to the sender of this message.": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044E.",
		"Compose a reply to all participants of this message.": "\u041E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432\u0441\u0435\u043C \u0443\u0447\u0430\u0441\u0442\u043D\u0438\u043A\u0430\u043C.",
		"Compose a forwarding message, optionally including attachments.": "\u041F\u0435\u0440\u0435\u0441\u043B\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E, \u043F\u0440\u0438 \u0436\u0435\u043B\u0430\u043D\u0438\u0438 \u0441 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C\u0438.",
		"More actions.": "\u0414\u0440\u0443\u0433\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F.",
		"More actions": "\u0414\u0440\u0443\u0433\u0438\u0435 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
		"undisclosed recipients": "\u0441\u043A\u0440\u044B\u0442\u044B\u0435 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0438",
		"(unknown sender)": "(\u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044C \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043D)",
		"To: ": "\u041A\u043E\u043C\u0443: ",
		" \xB7 Cc: ": " \xB7 \u041A\u043E\u043F\u0438\u044F: ",
		"Mailing list": "\u0421\u043F\u0438\u0441\u043E\u043A \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438",
		"Received: ": "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E: ",
		"Hide full headers.": "\u0421\u043A\u0440\u044B\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438.",
		"Show full headers.": "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0432\u0441\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438.",
		"To previous viewable attachment.": "\u041A \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u043C\u0443 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044E.",
		"Attachment shown as text.": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u043A\u0430\u043A \u0442\u0435\u043A\u0441\u0442.",
		"Attachment as PDF.": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043A\u0430\u043A PDF.",
		"Attachment could be a binary file.": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u0432\u043E\u0438\u0447\u043D\u044B\u043C \u0444\u0430\u0439\u043B\u043E\u043C.",
		"View as text": "\u041A\u0430\u043A \u0442\u0435\u043A\u0441\u0442",
		"Attachment shown as text, though it could be a binary file.": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u043A\u0430\u043A \u0442\u0435\u043A\u0441\u0442, \u0445\u043E\u0442\u044F \u043E\u043D\u043E \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0434\u0432\u043E\u0438\u0447\u043D\u044B\u043C.",
		"To next viewable attachment.": "\u041A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C\u0443 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044E.",
		"Attachments: ": "\u0412\u043B\u043E\u0436\u0435\u043D\u0438\u044F: ",
		"View this file. Size: ": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u0430\u0439\u043B. \u0420\u0430\u0437\u043C\u0435\u0440: ",
		"Download this file. Size: ": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0444\u0430\u0439\u043B. \u0420\u0430\u0437\u043C\u0435\u0440: ",
		"More...": "\u0415\u0449\u0451\u2026",
		"Download all as zip": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C \u0432\u0441\u0435 \u043A\u0430\u043A zip",
		"HTML version of message with images inlined, without external resources loaded.": "HTML-\u0432\u0435\u0440\u0441\u0438\u044F. \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0438\u0437 \u043F\u0438\u0441\u044C\u043C\u0430 \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u044B, \u0432\u043D\u0435\u0448\u043D\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044B \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044E\u0442\u0441\u044F.",
		"HTML version of message with images inlined and with external resources loaded.": "HTML-\u0432\u0435\u0440\u0441\u0438\u044F. \u041A\u0430\u0440\u0442\u0438\u043D\u043A\u0438 \u0438\u0437 \u043F\u0438\u0441\u044C\u043C\u0430 \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u044B, \u0432\u043D\u0435\u0448\u043D\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044B \u0437\u0430\u0433\u0440\u0443\u0436\u0430\u044E\u0442\u0441\u044F.",
		"Loading message": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u0438\u0441\u044C\u043C\u0430",
		"fetching message failed": "\u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E",
		"In the HTML viewer, the following potentially dangerous functionality is disabled: submitting forms, starting a download from a link, navigating away from this page by clicking a link. If a link does not work, try explicitly opening it in a new tab.": "\u0412 \u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435 HTML \u043E\u0442\u043A\u043B\u044E\u0447\u0435\u043D\u043E \u043E\u043F\u0430\u0441\u043D\u043E\u0435: \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0444\u043E\u0440\u043C, \u0441\u043A\u0430\u0447\u0438\u0432\u0430\u043D\u0438\u0435 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435 \u0438 \u0443\u0445\u043E\u0434 \u0441 \u044D\u0442\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435. \u0415\u0441\u043B\u0438 \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0435 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0435\u0442\u0441\u044F, \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0435\u0451 \u0432 \u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435.",
		"No textual content": "\u041D\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430",
		"HTML-only message": "\u041F\u0438\u0441\u044C\u043C\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u0432 HTML",
		"HTML ext": "HTML \u0432\u043D\u0435\u0448.",
		"HTML with external resources": "HTML \u0441 \u0432\u043D\u0435\u0448\u043D\u0438\u043C\u0438 \u0440\u0435\u0441\u0443\u0440\u0441\u0430\u043C\u0438",
		"Marking current message as read": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043F\u0438\u0441\u044C\u043C\u0430 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
		"Marking current message as not junk": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043F\u0438\u0441\u044C\u043C\u0430 \u043A\u0430\u043A \u043D\u0435 \u0441\u043F\u0430\u043C",
		"Moving to junk mailbox": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0432 \u0441\u043F\u0430\u043C",
		"No mailbox configured for junk yet.": "\u041F\u0430\u043F\u043A\u0430 \u0441\u043F\u0430\u043C\u0430 \u0435\u0449\u0451 \u043D\u0435 \u043D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0430.",
		"Marking as not junk": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043A\u0430\u043A \u043D\u0435 \u0441\u043F\u0430\u043C",
		"Marking as read": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
		"Marking as not read": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
		"Muting thread": "\u0417\u0430\u0433\u043B\u0443\u0448\u0435\u043D\u0438\u0435 \u0446\u0435\u043F\u043E\u0447\u043A\u0438",
		"Unmuting thread": "\u0421\u043D\u044F\u0442\u0438\u0435 \u0437\u0430\u0433\u043B\u0443\u0448\u043A\u0438",
		"Toggle muting threads is only available when threading is enabled.": "\u0417\u0430\u0433\u043B\u0443\u0448\u0430\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
		"Toggling thread collapse/expand is only available when threading is enabled.": "\u0421\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u043A\u043E\u0433\u0434\u0430 \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0432\u043A\u043B\u044E\u0447\u0435\u043D\u044B.",
		"Permanently delete messages.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430.",
		"Add/remove labels ...": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0438\u043B\u0438 \u0441\u043D\u044F\u0442\u044C \u043C\u0435\u0442\u043A\u0438\u2026",
		"Selected messages": "\u0412\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0438\u0441\u044C\u043C\u0430",
		" Recursive": " \u0412\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435",
		"Mbox ": "Mbox ",
		"Export as mbox file, not wrapped in an archive.": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442 \u0432 \u0444\u0430\u0439\u043B mbox, \u0431\u0435\u0437 \u0430\u0440\u0445\u0438\u0432\u0430.",
		"Maildir ": "Maildir ",
		"Mark as read": "\u041F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C \u0432\u0441\u0435",
		"Mark all messages in the mailbox and its sub mailboxes as read.": "\u041E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C\u0438 \u0432\u0441\u0435 \u043F\u0438\u0441\u044C\u043C\u0430 \u0432 \u044D\u0442\u043E\u0439 \u043F\u0430\u043F\u043A\u0435 \u0438 \u0432\u043E \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0445.",
		"Marking mailboxes as read": "\u041E\u0442\u043C\u0435\u0442\u043A\u0430 \u043F\u0430\u043F\u043E\u043A \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C\u0438",
		"Create mailbox": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0443",
		"Create new mailbox within this mailbox.": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0443 \u0432\u043D\u0443\u0442\u0440\u0438 \u044D\u0442\u043E\u0439.",
		"Create new mailbox.": "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0443.",
		"Creating mailbox": "\u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043F\u0430\u043F\u043A\u0438",
		"Name ": "\u0418\u043C\u044F ",
		"Move to trash": "\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
		"Move mailbox, its messages and its mailboxes to the trash.": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443, \u0435\u0451 \u043F\u0438\u0441\u044C\u043C\u0430 \u0438 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443.",
		"Are you sure you want to move this mailbox, its messages and its mailboxes to the trash?": "\u041F\u0435\u0440\u0435\u043C\u0435\u0441\u0442\u0438\u0442\u044C \u044D\u0442\u0443 \u043F\u0430\u043F\u043A\u0443, \u0435\u0451 \u043F\u0438\u0441\u044C\u043C\u0430 \u0438 \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443?",
		"Moving mailbox to trash": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u043F\u0430\u043F\u043A\u0438 \u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
		"Delete mailbox": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443",
		"Permanently delete this mailbox and all its messages.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u043F\u0430\u043F\u043A\u0443 \u0438 \u0432\u0441\u0435 \u0435\u0451 \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430.",
		"Are you sure you want to permanently delete this mailbox and all its messages?": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u043F\u0430\u043F\u043A\u0443 \u0438 \u0432\u0441\u0435 \u0435\u0451 \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430?",
		"Deleting mailbox": "\u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u043F\u0430\u043F\u043A\u0438",
		"Empty mailbox": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443",
		"Remove all messages from the mailbox, but not mailboxes inside this mailbox or their messages.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0432\u0441\u0435 \u043F\u0438\u0441\u044C\u043C\u0430 \u0438\u0437 \u043F\u0430\u043F\u043A\u0438. \u0412\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u0438 \u0438\u0445 \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0435 \u0442\u0440\u043E\u0433\u0430\u0442\u044C.",
		"Are you sure you want to empty this mailbox, permanently removing its messages? Mailboxes inside this mailbox are not affected.": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0443 \u0438 \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0435\u0451 \u043F\u0438\u0441\u044C\u043C\u0430? \u0412\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435 \u043F\u0430\u043F\u043A\u0438 \u043D\u0435 \u0437\u0430\u0442\u0440\u0430\u0433\u0438\u0432\u0430\u044E\u0442\u0441\u044F.",
		"Emptying mailbox": "\u041E\u0447\u0438\u0441\u0442\u043A\u0430 \u043F\u0430\u043F\u043A\u0438",
		"Rename mailbox": "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0443",
		"Renaming mailbox": "\u041F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0430\u043F\u043A\u0438",
		"Set role for mailbox...": "\u041D\u0430\u0437\u043D\u0430\u0447\u0438\u0442\u044C \u0440\u043E\u043B\u044C \u043F\u0430\u043F\u043A\u0438\u2026",
		"Set a special-use role on the mailbox, making it the designated mailbox for either Archived, Sent, Draft, Trashed or Junk messages.": "\u041D\u0430\u0437\u043D\u0430\u0447\u0438\u0442\u044C \u043F\u0430\u043F\u043A\u0435 \u0440\u043E\u043B\u044C: \u0430\u0440\u0445\u0438\u0432, \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435, \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0438, \u043A\u043E\u0440\u0437\u0438\u043D\u0430 \u0438\u043B\u0438 \u0441\u043F\u0430\u043C.",
		"Marking mailbox as special use": "\u041D\u0430\u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0440\u043E\u043B\u0438 \u043F\u0430\u043F\u043A\u0438",
		"Opening mailbox": "\u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0430\u043F\u043A\u0438",
		"Moving to ": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u0438\u0435 \u0432 ",
		"Mailbox actions": "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441 \u043F\u0430\u043F\u043A\u043E\u0439",
		"Actions on mailbox, like deleting, emptying, renaming.": "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441 \u043F\u0430\u043F\u043A\u043E\u0439: \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435, \u043E\u0447\u0438\u0441\u0442\u043A\u0430, \u043F\u0435\u0440\u0435\u0438\u043C\u0435\u043D\u043E\u0432\u0430\u043D\u0438\u0435.",
		"Total messages: ": "\u0412\u0441\u0435\u0433\u043E \u043F\u0438\u0441\u0435\u043C: ",
		" unread": " \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0445",
		"Mailboxes actions": "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441 \u043F\u0430\u043F\u043A\u0430\u043C\u0438",
		"Actions on mailboxes like creating a new mailbox or exporting all email.": "\u0414\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0441 \u043F\u0430\u043F\u043A\u0430\u043C\u0438: \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u043F\u0430\u043F\u043A\u0443 \u0438\u043B\u0438 \u044D\u043A\u0441\u043F\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0447\u0442\u0443.",
		"Requesting messages": "\u0417\u0430\u043F\u0440\u043E\u0441 \u043F\u0438\u0441\u0435\u043C",
		"unknown mailbox": "\u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043F\u0430\u043F\u043A\u0430",
		"Header name": "\u0418\u043C\u044F \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430",
		"Header value": "\u0417\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430",
		"Add row for another header filter.": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0435\u0449\u0451 \u043E\u0434\u0438\u043D \u0444\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0443.",
		"Remove row.": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0441\u0442\u0440\u043E\u043A\u0443.",
		"Close search.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0438\u0441\u043A.",
		"Filter by mailbox, including children of the mailbox.": "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u043F\u0430\u043F\u043A\u0435, \u0432\u043A\u043B\u044E\u0447\u0430\u044F \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0435.",
		"All mailboxes except Trash/Junk/Rejects": "\u0412\u0441\u0435 \u043F\u0430\u043F\u043A\u0438, \u043A\u0440\u043E\u043C\u0435 \u043A\u043E\u0440\u0437\u0438\u043D\u044B, \u0441\u043F\u0430\u043C\u0430 \u0438 \u043E\u0442\u043A\u0430\u0437\u043E\u0432",
		"All mailboxes": "\u0412\u0441\u0435 \u043F\u0430\u043F\u043A\u0438",
		"Filter by text, case-insensitive, substring match, not necessarily whole words.": "\u0424\u0438\u043B\u044C\u0442\u0440 \u043F\u043E \u0442\u0435\u043A\u0441\u0442\u0443, \u0431\u0435\u0437 \u0443\u0447\u0451\u0442\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430, \u043F\u043E \u0447\u0430\u0441\u0442\u0438 \u0441\u043B\u043E\u0432\u0430.",
		"Address or name": "\u0410\u0434\u0440\u0435\u0441 \u0438\u043B\u0438 \u0438\u043C\u044F",
		"Search on addressee, including Cc and Bcc headers.": "\u041F\u043E\u0438\u0441\u043A \u043F\u043E \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044E, \u0432\u043A\u043B\u044E\u0447\u0430\u044F \u043A\u043E\u043F\u0438\u044E \u0438 \u0441\u043A\u0440\u044B\u0442\u0443\u044E \u043A\u043E\u043F\u0438\u044E.",
		"Address or name, also matches Cc and Bcc addresses": "\u0410\u0434\u0440\u0435\u0441 \u0438\u043B\u0438 \u0438\u043C\u044F, \u0442\u0430\u043A\u0436\u0435 \u043A\u043E\u043F\u0438\u044F \u0438 \u0441\u043A\u0440\u044B\u0442\u0430\u044F \u043A\u043E\u043F\u0438\u044F",
		"Received between": "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u043E \u043C\u0435\u0436\u0434\u0443",
		"Clear start date.": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043D\u0430\u0447\u0430\u043B\u0430.",
		"Clear end date.": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0434\u0430\u0442\u0443 \u043A\u043E\u043D\u0446\u0430.",
		" None": " \u041D\u0435\u0442",
		" Any": " \u041B\u044E\u0431\u044B\u0435",
		" Images": " \u0418\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F",
		" PDFs": " PDF",
		" Archives": " \u0410\u0440\u0445\u0438\u0432\u044B",
		" Spreadsheets": " \u0422\u0430\u0431\u043B\u0438\u0446\u044B",
		" Documents": " \u0414\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u044B",
		" Presentations": " \u041F\u0440\u0435\u0437\u0435\u043D\u0442\u0430\u0446\u0438\u0438",
		"User-defined labels.": "\u0421\u0432\u043E\u0438 \u043C\u0435\u0442\u043A\u0438.",
		"Size between": "\u0420\u0430\u0437\u043C\u0435\u0440 \u043C\u0435\u0436\u0434\u0443",
		"loading...": "\u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430...",
		"Refine:": "\u0424\u0438\u043B\u044C\u0442\u0440",
		"Refine message listing with quick filters. These refinement filters are in addition to any search criteria, but the refine attachment filter overrides a search attachment criteria.": "\u0411\u044B\u0441\u0442\u0440\u044B\u0435 \u0444\u0438\u043B\u044C\u0442\u0440\u044B \u0441\u043F\u0438\u0441\u043A\u0430. \u041E\u043D\u0438 \u0434\u043E\u0431\u0430\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u043A \u043F\u043E\u0438\u0441\u043A\u0443. \u0424\u0438\u043B\u044C\u0442\u0440 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0437\u0434\u0435\u0441\u044C \u0437\u0430\u043C\u0435\u043D\u044F\u0435\u0442 \u0443\u0441\u043B\u043E\u0432\u0438\u0435 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0439 \u0432 \u043F\u043E\u0438\u0441\u043A\u0435.",
		"Only show messages marked as unread.": "\u0422\u043E\u043B\u044C\u043A\u043E \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435.",
		"Only show messages marked as read.": "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435.",
		"Only show messages with attachments.": "\u0422\u043E\u043B\u044C\u043A\u043E \u0441 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u043C\u0438.",
		"Only show flagged/starred messages.": "\u0422\u043E\u043B\u044C\u043A\u043E \u043E\u0442\u043C\u0435\u0447\u0435\u043D\u043D\u044B\u0435 \u0444\u043B\u0430\u0436\u043A\u043E\u043C.",
		"No labels yet": "\u041C\u0435\u0442\u043E\u043A \u043F\u043E\u043A\u0430 \u043D\u0435\u0442",
		"Clear refinement filters.": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u0443\u0442\u043E\u0447\u043D\u0435\u043D\u0438\u044F.",
		"Thread modes.": "\u0420\u0435\u0436\u0438\u043C \u0446\u0435\u043F\u043E\u0447\u0435\u043A.",
		"Threads: Off": "\u0412\u044B\u043A\u043B",
		"Threads: On": "\u0412\u043A\u043B",
		"Threads: Unread": "\u041D\u0435\u043F\u0440\u043E\u0447.",
		"Toggle sorting by date received.": "\u0421\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u043F\u043E \u0434\u0430\u0442\u0435 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F.",
		"Logging out": "\u0412\u044B\u0445\u043E\u0434",
		"Top bar": "\u0412\u0435\u0440\u0445\u043D\u044F\u044F \u043F\u0430\u043D\u0435\u043B\u044C",
		"Compose new email message.": "\u041D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E.",
		"Open mailboxes.": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043F\u0430\u043F\u043A\u0438.",
		"Search...": "\u041F\u043E\u0438\u0441\u043A...",
		"Search messages based on criteria like matching free-form text, in a mailbox, labels, addressees.": "\u0418\u0441\u043A\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0430 \u043F\u043E \u0442\u0435\u043A\u0441\u0442\u0443, \u043F\u0430\u043F\u043A\u0435, \u043C\u0435\u0442\u043A\u0430\u043C \u0438 \u0430\u0434\u0440\u0435\u0441\u0430\u043C.",
		"Cancel and clear search and open Inbox.": "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u043E\u0438\u0441\u043A \u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435.",
		"Cannot find inbox.": "\u041F\u0430\u043F\u043A\u0430 \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0445 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430.",
		"Back to message list.": "\u041A \u0441\u043F\u0438\u0441\u043A\u0443 \u043F\u0438\u0441\u0435\u043C.",
		"Auto layout": "\u0410\u0432\u0442\u043E\u043C\u0430\u043A\u0435\u0442",
		"Top/bottom": "\u0421\u0432\u0435\u0440\u0445\u0443/\u0441\u043D\u0438\u0437\u0443",
		"Left/right": "\u0421\u043B\u0435\u0432\u0430/\u0441\u043F\u0440\u0430\u0432\u0430",
		"Layout of message list and message panes. Top/bottom has message list above message view. Left/Right has message list left, message view right. Auto selects based on window width and automatically switches on resize. Wide screens get left/right, smaller screens get top/bottom.": "\u0420\u0430\u0441\u043F\u043E\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0441\u043F\u0438\u0441\u043A\u0430 \u0438 \u043F\u0438\u0441\u044C\u043C\u0430. \u0421\u0432\u0435\u0440\u0445\u0443/\u0441\u043D\u0438\u0437\u0443: \u0441\u043F\u0438\u0441\u043E\u043A \u043D\u0430\u0434 \u043F\u0438\u0441\u044C\u043C\u043E\u043C. \u0421\u043B\u0435\u0432\u0430/\u0441\u043F\u0440\u0430\u0432\u0430: \u0441\u043F\u0438\u0441\u043E\u043A \u0441\u043B\u0435\u0432\u0430, \u043F\u0438\u0441\u044C\u043C\u043E \u0441\u043F\u0440\u0430\u0432\u0430. \u0410\u0432\u0442\u043E \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u043F\u043E \u0448\u0438\u0440\u0438\u043D\u0435 \u043E\u043A\u043D\u0430.",
		'Show tooltips, based on the title attributes (underdotted text) for the focused element and all user interface elements below it. Use the keyboard shortcut "ctrl ?" instead of clicking on the tooltip button, which changes focus to the tooltip button.': "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0438 \u0443 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0432 \u0444\u043E\u043A\u0443\u0441\u0435 \u0438 \u0443 \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u043E\u0432 \u043F\u043E\u0434 \u043D\u0438\u043C. \u0421\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u0435 \u043A\u043B\u0430\u0432\u0438\u0448 ctrl ? \u0443\u0434\u043E\u0431\u043D\u0435\u0435 \u043A\u043D\u043E\u043F\u043A\u0438, \u043F\u043E\u0442\u043E\u043C\u0443 \u0447\u0442\u043E \u043A\u043D\u043E\u043F\u043A\u0430 \u0437\u0430\u0431\u0438\u0440\u0430\u0435\u0442 \u0444\u043E\u043A\u0443\u0441.",
		"Show popup with basic usage information and a keyboard shortcuts.": "\u041A\u0440\u0430\u0442\u043A\u0430\u044F \u0441\u043F\u0440\u0430\u0432\u043A\u0430 \u0438 \u0441\u043E\u0447\u0435\u0442\u0430\u043D\u0438\u044F \u043A\u043B\u0430\u0432\u0438\u0448.",
		"Change settings for composing messages.": "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043D\u0430\u043F\u0438\u0441\u0430\u043D\u0438\u044F \u043F\u0438\u0441\u0435\u043C.",
		"Logout, invalidating this session.": "\u0412\u044B\u0439\u0442\u0438 \u0438 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u044C \u0441\u0435\u0430\u043D\u0441.",
		"Decoding MIME words for subject": "\u0420\u0430\u0437\u0431\u043E\u0440 \u0442\u0435\u043C\u044B",
		"Error parsing compose mailto URL: ": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0441\u0441\u044B\u043B\u043A\u0438 mailto: ",
		"Loading compose message": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u0438\u0441\u044C\u043C\u0430",
		"Error opening draft message: ": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0430: ",
		"Not connected": "\u041D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F",
		"Not receiving real-time updates, including of new deliveries.": "\u041D\u0435\u0442 \u0436\u0438\u0432\u044B\u0445 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439, \u0432 \u0442\u043E\u043C \u0447\u0438\u0441\u043B\u0435 \u043E \u043D\u043E\u0432\u044B\u0445 \u043F\u0438\u0441\u044C\u043C\u0430\u0445.",
		"Fetching token for connection with real-time updates": "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043A\u043B\u044E\u0447\u0430 \u0434\u043B\u044F \u0436\u0438\u0432\u044B\u0445 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0439",
		"Error fetching connection token": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u044F \u043A\u043B\u044E\u0447\u0430 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F",
		", not automatically retrying. ": ", \u043F\u043E\u0432\u0442\u043E\u0440 \u0441\u0430\u043C \u043D\u0435 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0441\u044F. ",
		"Error parsing mailto URL: ": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u0441\u0441\u044B\u043B\u043A\u0438 mailto: ",
		"Connecting... ": "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435... ",
		"(not connected)": "(\u043D\u0435\u0442 \u0441\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u044F)",
		"Connection failed": "\u0421\u043E\u0435\u0434\u0438\u043D\u0435\u043D\u0438\u0435 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C",
		"(no error message)": "(\u043D\u0435\u0442 \u0442\u0435\u043A\u0441\u0442\u0430 \u043E\u0448\u0438\u0431\u043A\u0438)",
		'Server error: "': "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: \xAB",
		"Server shutting down, will try to reconnect in a few seconds": "\u0421\u0435\u0440\u0432\u0435\u0440 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u0435\u0442\u0441\u044F, \u043F\u043E\u0432\u0442\u043E\u0440 \u0447\u0435\u0440\u0435\u0437 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0441\u0435\u043A\u0443\u043D\u0434",
		"invalid event from server: ": "\u043D\u0435\u043F\u043E\u043D\u044F\u0442\u043D\u043E\u0435 \u0441\u043E\u0431\u044B\u0442\u0438\u0435 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: ",
		"(no message)": "(\u043D\u0435\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F)",
		"Saving before reloading due to server update": "\u0421\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 \u043F\u0435\u0440\u0435\u0434 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435\u043C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B",
		"Error from server during request for messages: ": "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430 \u043F\u0440\u0438 \u0437\u0430\u043F\u0440\u043E\u0441\u0435 \u043F\u0438\u0441\u0435\u043C: ",
		"Could not find message to continue scrolling, resetting the view.": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u043F\u0438\u0441\u044C\u043C\u043E, \u0447\u0442\u043E\u0431\u044B \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u043A\u0443. \u0421\u043F\u0438\u0441\u043E\u043A \u043E\u0431\u043D\u043E\u0432\u043B\u044F\u0435\u0442\u0441\u044F.",
		"Error processing changes (reloading advised): ": "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u043A\u0438 \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u0439, \u043B\u0443\u0447\u0448\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443: ",
		" (not available)": " (\u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E)",
		"A JavaScript error occurred": "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 JavaScript",
		"Close error details.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438 \u043E\u0448\u0438\u0431\u043A\u0438.",
		"There is a good chance this is a bug in Mox Webmail.": "\u0421\u043A\u043E\u0440\u0435\u0435 \u0432\u0441\u0435\u0433\u043E, \u044D\u0442\u043E \u043E\u0448\u0438\u0431\u043A\u0430 \u0432\u0435\u0431-\u043F\u043E\u0447\u0442\u044B Mox.",
		'Consider filing a bug report ("issue") at ': "\u041C\u043E\u0436\u043D\u043E \u0441\u043E\u043E\u0431\u0449\u0438\u0442\u044C \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0435 \u0437\u0434\u0435\u0441\u044C: ",
		'mox webmail js error: "': "\u043E\u0448\u0438\u0431\u043A\u0430 JavaScript \u0432\u0435\u0431-\u043F\u043E\u0447\u0442\u044B mox: \xAB",
		". The link includes the error details.": ". \u0412 \u0441\u0441\u044B\u043B\u043A\u0435 \u0443\u0436\u0435 \u0435\u0441\u0442\u044C \u043F\u043E\u0434\u0440\u043E\u0431\u043D\u043E\u0441\u0442\u0438.",
		"Before reporting you could check previous ": "\u041F\u0435\u0440\u0435\u0434 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435\u043C \u043C\u043E\u0436\u043D\u043E \u043F\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043F\u0440\u0435\u0436\u043D\u0438\u0435 ",
		"webmail bug reports": "\u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0430\u0445",
		"Your feedback will help improve mox, thanks!": "\u0422\u0430\u043A mox \u0441\u0442\u0430\u043D\u0435\u0442 \u043B\u0443\u0447\u0448\u0435, \u0441\u043F\u0430\u0441\u0438\u0431\u043E.",
		"Silence for 1 week": "\u0417\u0430\u043C\u043E\u043B\u0447\u0430\u0442\u044C \u043D\u0430 \u043D\u0435\u0434\u0435\u043B\u044E",
		"Error: ": "\u041E\u0448\u0438\u0431\u043A\u0430: ",
		"login error": "\u043E\u0448\u0438\u0431\u043A\u0430 \u0432\u0445\u043E\u0434\u0430",
		"Reply above/below original": "\u041E\u0442\u0432\u0435\u0442 \u043D\u0430\u0434 \u0446\u0438\u0442\u0430\u0442\u043E\u0439 \u0438\u043B\u0438 \u043F\u043E\u0434 \u043D\u0435\u0439",
		"Auto: If text is selected, only the replied text is quoted and editing starts below. Otherwise, the full message is quoted and editing starts at the top.": "\u0410\u0432\u0442\u043E: \u0435\u0441\u043B\u0438 \u0432\u044B\u0434\u0435\u043B\u0435\u043D \u0442\u0435\u043A\u0441\u0442, \u0446\u0438\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u043E\u043D, \u0438 \u043A\u0443\u0440\u0441\u043E\u0440 \u0441\u0442\u0430\u0432\u0438\u0442\u0441\u044F \u043D\u0438\u0436\u0435. \u0418\u043D\u0430\u0447\u0435 \u0446\u0438\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u0432\u0441\u0451 \u043F\u0438\u0441\u044C\u043C\u043E, \u0438 \u043A\u0443\u0440\u0441\u043E\u0440 \u0441\u0442\u0430\u0432\u0438\u0442\u0441\u044F \u0441\u0432\u0435\u0440\u0445\u0443.",
		"Show address security indications": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u0437\u0430\u0449\u0438\u0442\u0443 \u0430\u0434\u0440\u0435\u0441\u0430",
		"Show bars underneath address input fields, indicating support for STARTTLS/DNSSEC/DANE/MTA-STS/RequireTLS.": "\u041F\u043E\u043B\u043E\u0441\u043A\u0438 \u043F\u043E\u0434 \u043F\u043E\u043B\u0435\u043C \u0430\u0434\u0440\u0435\u0441\u0430: \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 STARTTLS, DNSSEC, DANE, MTA-STS \u0438 RequireTLS.",
		"Show email as HTML instead of text by default for first-time senders": "\u0414\u043B\u044F \u043D\u043E\u0432\u044B\u0445 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u0435\u0439 \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C HTML, \u0430 \u043D\u0435 \u0442\u0435\u043A\u0441\u0442",
		"Whether to show HTML or text is remembered per sender. This sets the default for unknown correspondents.": "\u0412\u044B\u0431\u043E\u0440 HTML \u0438\u043B\u0438 \u0442\u0435\u043A\u0441\u0442\u0430 \u0437\u0430\u043F\u043E\u043C\u0438\u043D\u0430\u0435\u0442\u0441\u044F \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u0435\u043B\u044F. \u0417\u0434\u0435\u0441\u044C \u0437\u0430\u0434\u0430\u0451\u0442\u0441\u044F \u0432\u0438\u0434 \u0434\u043B\u044F \u043D\u0435\u0437\u043D\u0430\u043A\u043E\u043C\u044B\u0445.",
		"Show shortcut keys in bottom left after interaction with mouse": "\u041F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0442\u044C \u043A\u043B\u0430\u0432\u0438\u0448\u0438 \u0432\u043D\u0438\u0437\u0443 \u0441\u043B\u0435\u0432\u0430 \u043F\u043E\u0441\u043B\u0435 \u0449\u0435\u043B\u0447\u043A\u0430 \u043C\u044B\u0448\u044C\u044E",
		"Show additional headers": "\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438",
		"One header name per line, for example Delivered-To, X-Mox-Reason, User-Agent, \u2026 Refresh mailbox view for changes to take effect.": "\u041F\u043E \u043E\u0434\u043D\u043E\u043C\u0443 \u0438\u043C\u0435\u043D\u0438 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0430 \u0432 \u0441\u0442\u0440\u043E\u043A\u0435, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 Delivered-To, X-Mox-Reason, User-Agent. \u0427\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u0438\u0437\u043C\u0435\u043D\u0435\u043D\u0438\u044F, \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u043F\u0430\u043F\u043A\u0443.",
		"Close without saving.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0431\u0435\u0437 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F.",
		"In most browsers, registering is only allowed on HTTPS URLs. Your browser may ask for confirmation. If nothing appears to happen, the registration may already have been present.": "\u0412 \u0431\u043E\u043B\u044C\u0448\u0438\u043D\u0441\u0442\u0432\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u043E\u0432 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E HTTPS. \u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u043C\u043E\u0436\u0435\u0442 \u0441\u043F\u0440\u043E\u0441\u0438\u0442\u044C \u043F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435. \u0415\u0441\u043B\u0438 \u043D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u043E, \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A \u0443\u0436\u0435 \u043C\u043E\u0433 \u0431\u044B\u0442\u044C \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D.",
		'Registering a protocol handler ("mailto:") is not supported by your browser.': "\u042D\u0442\u043E\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043D\u0435 \u0443\u043C\u0435\u0435\u0442 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A mailto:.",
		'"mailto:"-links have been registered': "\u0421\u0441\u044B\u043B\u043A\u0438 mailto: \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u044B",
		'Error registering "mailto:" protocol handler: ': "\u041E\u0448\u0438\u0431\u043A\u0430 \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 mailto: ",
		"Not all browsers implement unregistering via JavaScript.": "\u041D\u0435 \u0432\u0441\u0435 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u044B \u0443\u043C\u0435\u044E\u0442 \u0441\u043D\u0438\u043C\u0430\u0442\u044C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044E \u0438\u0437 \u0441\u043A\u0440\u0438\u043F\u0442\u0430.",
		'Unregistering a protocol handler ("mailto:") via JavaScript is not supported by your browser. See your browser settings to unregister.': "\u042D\u0442\u043E\u0442 \u0431\u0440\u0430\u0443\u0437\u0435\u0440 \u043D\u0435 \u0443\u043C\u0435\u0435\u0442 \u0441\u043D\u0438\u043C\u0430\u0442\u044C \u043E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A mailto: \u0438\u0437 \u0441\u043A\u0440\u0438\u043F\u0442\u0430. \u0421\u043D\u0438\u043C\u0438\u0442\u0435 \u0435\u0433\u043E \u0432 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u0445 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0430.",
		'Error unregistering "mailto:" protocol handler: ': "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043D\u044F\u0442\u0438\u044F \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u0438 mailto: ",
		'"mailto:" protocol handler unregistered.': "\u041E\u0431\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A mailto: \u0441\u043D\u044F\u0442.",
		"Help and keyboard shortcuts": "\u0421\u043F\u0440\u0430\u0432\u043A\u0430 \u0438 \u043A\u043B\u0430\u0432\u0438\u0448\u0438",
		"Close help.": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u0441\u043F\u0440\u0430\u0432\u043A\u0443.",
		"compose new message": "\u043D\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E",
		"search": "\u043F\u043E\u0438\u0441\u043A",
		"open inbox": "\u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0435",
		"help": "\u0441\u043F\u0440\u0430\u0432\u043A\u0430",
		"tooltip for focused element": "\u043F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 \u0434\u043B\u044F \u044D\u043B\u0435\u043C\u0435\u043D\u0442\u0430 \u0432 \u0444\u043E\u043A\u0443\u0441\u0435",
		"focus message": "\u043F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u043F\u0438\u0441\u044C\u043C\u0443",
		"collapse": "\u0441\u0432\u0435\u0440\u043D\u0443\u0442\u044C",
		"expand": "\u0440\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C",
		"show more actions": "\u0435\u0449\u0451 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F",
		"down one message": "\u043D\u0430 \u043F\u0438\u0441\u044C\u043C\u043E \u0432\u043D\u0438\u0437",
		"up one message": "\u043D\u0430 \u043F\u0438\u0441\u044C\u043C\u043E \u0432\u0432\u0435\u0440\u0445",
		"down one screen": "\u043D\u0430 \u044D\u043A\u0440\u0430\u043D \u0432\u043D\u0438\u0437",
		"up one screen": "\u043D\u0430 \u044D\u043A\u0440\u0430\u043D \u0432\u0432\u0435\u0440\u0445",
		"to last message": "\u043A \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u043C\u0443 \u043F\u0438\u0441\u044C\u043C\u0443",
		"to first message": "\u043A \u043F\u0435\u0440\u0432\u043E\u043C\u0443 \u043F\u0438\u0441\u044C\u043C\u0443",
		"toggle selection of message": "\u0432\u044B\u0431\u0440\u0430\u0442\u044C \u0438\u043B\u0438 \u0441\u043D\u044F\u0442\u044C \u0432\u044B\u0431\u043E\u0440",
		"move to trash folder": "\u0432 \u043A\u043E\u0440\u0437\u0438\u043D\u0443",
		"delete permanently": "\u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043D\u0430\u0432\u0441\u0435\u0433\u0434\u0430",
		"move to junk folder": "\u0432 \u0441\u043F\u0430\u043C",
		"mark not junk": "\u043E\u0442\u043C\u0435\u0442\u0438\u0442\u044C \u043A\u0430\u043A \u043D\u0435 \u0441\u043F\u0430\u043C",
		"move to archive folder": "\u0432 \u0430\u0440\u0445\u0438\u0432",
		"mark unread and clear (non)junk flags": "\u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C \u0438 \u0441\u043D\u044F\u0442\u044C \u043C\u0435\u0442\u043A\u0438 \u0441\u043F\u0430\u043C\u0430",
		"mark read": "\u0441\u0434\u0435\u043B\u0430\u0442\u044C \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C",
		"to next unread message": "\u043A \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C\u0443 \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u043E\u043C\u0443",
		"to root of thread or previous thread": "\u043A \u043D\u0430\u0447\u0430\u043B\u0443 \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0438\u043B\u0438 \u043A \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0439",
		"to root of next thread": "\u043A \u043D\u0430\u0447\u0430\u043B\u0443 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u0446\u0435\u043F\u043E\u0447\u043A\u0438",
		"select thread messages": "\u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u0430 \u0446\u0435\u043F\u043E\u0447\u043A\u0438",
		"toggle thread collapse": "\u0441\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0438\u043B\u0438 \u0440\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443",
		"toggle thread mute, automatically marking new messages as read": "\u0437\u0430\u0433\u043B\u0443\u0448\u0438\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443, \u043D\u043E\u0432\u044B\u0435 \u043F\u0438\u0441\u044C\u043C\u0430 \u0431\u0443\u0434\u0443\u0442 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C\u0438",
		"collapse thread": "\u0441\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443",
		"expand thread": "\u0440\u0430\u0437\u0432\u0435\u0440\u043D\u0443\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443",
		"send message": "\u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C",
		"send message and archive thread": "\u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0438 \u0443\u0431\u0440\u0430\u0442\u044C \u0446\u0435\u043F\u043E\u0447\u043A\u0443 \u0432 \u0430\u0440\u0445\u0438\u0432",
		"close message": "\u0437\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E",
		"add To": "\u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u041A\u043E\u043C\u0443",
		"add Cc": "\u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043A\u043E\u043F\u0438\u044E",
		"add Bcc": "\u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0441\u043A\u0440\u044B\u0442\u0443\u044E \u043A\u043E\u043F\u0438\u044E",
		"add Reply-To": "\u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043E\u0431\u0440\u0430\u0442\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441",
		"remove current address if empty": "\u0443\u0434\u0430\u043B\u0438\u0442\u044C \u043F\u0443\u0441\u0442\u043E\u0439 \u0430\u0434\u0440\u0435\u0441",
		"add address of same type": "\u0434\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0430\u0434\u0440\u0435\u0441 \u0442\u043E\u0433\u043E \u0436\u0435 \u0432\u0438\u0434\u0430",
		"reply or list reply": "\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0438\u043B\u0438 \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432 \u0441\u043F\u0438\u0441\u043E\u043A",
		"reply all": "\u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C \u0432\u0441\u0435\u043C",
		"forward message": "\u043F\u0435\u0440\u0435\u0441\u043B\u0430\u0442\u044C",
		"edit draft": "\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A",
		"view attachments": "\u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
		"view text version": "\u0442\u0435\u043A\u0441\u0442\u043E\u0432\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F",
		"view HTML version": "HTML-\u0432\u0435\u0440\u0441\u0438\u044F",
		"open message in new tab": "\u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0432 \u043D\u043E\u0432\u043E\u0439 \u0432\u043A\u043B\u0430\u0434\u043A\u0435",
		"show raw message": "\u043F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u043E\u0440\u0438\u0433\u0438\u043D\u0430\u043B",
		"print message": "\u043F\u0435\u0447\u0430\u0442\u044C",
		"toggle internals": "\u0441\u043B\u0443\u0436\u0435\u0431\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435",
		"toggle all headers": "\u0432\u0441\u0435 \u0437\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438",
		"scroll up": "\u043F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u0442\u044C \u0432\u0432\u0435\u0440\u0445",
		"scroll down": "\u043F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u0442\u044C \u0432\u043D\u0438\u0437",
		"scroll to top": "\u0432 \u043D\u0430\u0447\u0430\u043B\u043E",
		"scroll to end": "\u0432 \u043A\u043E\u043D\u0435\u0446",
		"previous attachment": "\u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
		"next attachment": "\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
		"first attachment": "\u043F\u0435\u0440\u0432\u043E\u0435 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
		"download": "\u0441\u043A\u0430\u0447\u0430\u0442\u044C",
		"hold ctrl to only move focus": "\u0441 ctrl \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u0435\u0440\u0435\u043D\u043E\u0441 \u0444\u043E\u043A\u0443\u0441\u0430",
		"hold shift to expand selection": "\u0441 shift \u0440\u0430\u0441\u0448\u0438\u0440\u0438\u0442\u044C \u0432\u044B\u0431\u043E\u0440",
		"ctrl-l and ctrl-u are left for the browser the handle": "ctrl-l \u0438 ctrl-u \u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u044B \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0443",
		"Underdotted text": "\u041F\u0443\u043D\u043A\u0442\u0438\u0440",
		"Underdotted text shows additional information on hover.": "\u041F\u0443\u043D\u043A\u0442\u0438\u0440 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438.",
		" show an explanation or additional information when hovered.": " \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u043F\u043E\u044F\u0441\u043D\u0435\u043D\u0438\u0435 \u043F\u0440\u0438 \u043D\u0430\u0432\u0435\u0434\u0435\u043D\u0438\u0438.",
		"Multiple messages can be selected by clicking messages while holding the control and/or shift keys. Dragging messages and dropping them on a mailbox moves the messages to that mailbox.": "\u041D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u043F\u0438\u0441\u0435\u043C \u0432\u044B\u0431\u0438\u0440\u0430\u044E\u0442\u0441\u044F \u0449\u0435\u043B\u0447\u043A\u043E\u043C \u0441 ctrl \u0438\u043B\u0438 shift. \u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435 \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0430 \u043F\u0430\u043F\u043A\u0443 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u0435\u0442 \u0435\u0433\u043E \u0442\u0443\u0434\u0430.",
		"orange underline": "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u043E\u0435 \u043F\u043E\u0434\u0447\u0451\u0440\u043A\u0438\u0432\u0430\u043D\u0438\u0435",
		"A word that mixes scripts, such as Latin and Cyrillic, with no space between them has an ": "\u0421\u043B\u043E\u0432\u043E, \u0432 \u043A\u043E\u0442\u043E\u0440\u043E\u043C \u0431\u0435\u0437 \u043F\u0440\u043E\u0431\u0435\u043B\u0430 \u0441\u043C\u0435\u0448\u0430\u043D\u044B \u043F\u0438\u0441\u044C\u043C\u0435\u043D\u043D\u043E\u0441\u0442\u0438, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u043B\u0430\u0442\u0438\u043D\u0438\u0446\u0430 \u0438 \u043A\u0438\u0440\u0438\u043B\u043B\u0438\u0446\u0430, \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442 ",
		". That can be a sign of an intent to mislead (e.g. phishing).": ". \u0422\u0430\u043A \u0438\u043D\u043E\u0433\u0434\u0430 \u043C\u0430\u0441\u043A\u0438\u0440\u0443\u044E\u0442 \u0434\u0440\u0443\u0433\u043E\u0435 \u0441\u043B\u043E\u0432\u043E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 \u043F\u0440\u0438 \u0444\u0438\u0448\u0438\u043D\u0433\u0435.",
		"Mox is open source email server software, this is version ": "Mox \u2014 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u044B\u0439 \u043F\u043E\u0447\u0442\u043E\u0432\u044B\u0439 \u0441\u0435\u0440\u0432\u0435\u0440, \u044D\u0442\u043E \u0432\u0435\u0440\u0441\u0438\u044F ",
		"licenses": "\u043B\u0438\u0446\u0435\u043D\u0437\u0438\u0438",
		"Feedback, including bug reports, is appreciated! ": "\u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043E\u0431 \u043E\u0448\u0438\u0431\u043A\u0430\u0445 \u0438 \u043E\u0442\u0437\u044B\u0432\u044B \u043F\u043E\u043B\u0435\u0437\u043D\u044B. ",
		"Replied/answered": "\u0415\u0441\u0442\u044C \u043E\u0442\u0432\u0435\u0442",
		"Flagged": "\u0424\u043B\u0430\u0436\u043E\u043A",
		"Forwarded": "\u041F\u0435\u0440\u0435\u0441\u043B\u0430\u043D\u043E",
		"Deleted, used in IMAP, message will likely be removed soon.": "\u041F\u043E\u043C\u0435\u0447\u0435\u043D\u043E \u043A \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044E \u0432 IMAP, \u043F\u0438\u0441\u044C\u043C\u043E \u0441\u043A\u043E\u0440\u043E \u0438\u0441\u0447\u0435\u0437\u043D\u0435\u0442.",
		"Phishing": "\u0424\u0438\u0448\u0438\u043D\u0433",
		"Unclassified, neither junk nor not junk: message does not contribute to spam classification of new incoming messages": "\u041D\u0435 \u0440\u0430\u0437\u043E\u0431\u0440\u0430\u043D\u043E: \u043D\u0438 \u0441\u043F\u0430\u043C, \u043D\u0438 \u043D\u0435 \u0441\u043F\u0430\u043C. \u041D\u0430 \u043E\u0446\u0435\u043D\u043A\u0443 \u043D\u043E\u0432\u044B\u0445 \u043F\u0438\u0441\u0435\u043C \u043D\u0435 \u0432\u043B\u0438\u044F\u0435\u0442.",
		"Has at least one attachment": "\u0415\u0441\u0442\u044C \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0435",
		"Muted, new messages are automatically marked as read.": "\u0417\u0430\u0433\u043B\u0443\u0448\u0435\u043D\u043E, \u043D\u043E\u0432\u044B\u0435 \u043F\u0438\u0441\u044C\u043C\u0430 \u0441\u0440\u0430\u0437\u0443 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435.",
		"Move to the Archive mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.": "\u0412 \u0430\u0440\u0445\u0438\u0432. \u0418\u0437 \u043F\u0430\u043F\u043A\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u0438\u0441\u044C\u043C\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u044E\u0442\u0441\u044F, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u043D\u043E \u043E\u0434\u043D\u043E \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u0441\u0430\u043C\u0430 \u043F\u0430\u043F\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445.",
		"Move to the Trash mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.": "\u0412 \u043A\u043E\u0440\u0437\u0438\u043D\u0443. \u0418\u0437 \u043F\u0430\u043F\u043A\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u0438\u0441\u044C\u043C\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u044E\u0442\u0441\u044F, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u043D\u043E \u043E\u0434\u043D\u043E \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u0441\u0430\u043C\u0430 \u043F\u0430\u043F\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445.",
		"Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.": "\u0412 \u0441\u043F\u0430\u043C. \u041F\u0438\u0441\u044C\u043C\u043E \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0435\u0442\u0441\u044F \u043F\u0440\u0438 \u043E\u0446\u0435\u043D\u043A\u0435 \u043D\u043E\u0432\u044B\u0445 \u0432\u0445\u043E\u0434\u044F\u0449\u0438\u0445. \u0418\u0437 \u043F\u0430\u043F\u043A\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445 \u043F\u0438\u0441\u044C\u043C\u0430 \u043F\u0435\u0440\u0435\u043C\u0435\u0449\u0430\u044E\u0442\u0441\u044F, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0432\u044B\u0431\u0440\u0430\u043D\u043E \u043E\u0434\u043D\u043E \u0438\u043B\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0430 \u0441\u0430\u043C\u0430 \u043F\u0430\u043F\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0445.",
		"Default": "\u041E\u0431\u044B\u0447\u043D\u043E",
		"Require TLS": "\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u044C TLS",
		"Moving back": "\u0412\u043E\u0437\u0432\u0440\u0430\u0442",
		"Moved": "\u041F\u0435\u0440\u0435\u043C\u0435\u0449\u0435\u043D\u043E",
		"Unknown message type ": "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u0432\u0438\u0434 \u043F\u0438\u0441\u044C\u043C\u0430 ",
		"Message body.": "\u0422\u0435\u043A\u0441\u0442 \u043F\u0438\u0441\u044C\u043C\u0430.",
		"Off: Threading disabled, messages are shown individually.\nOn: Group messages in threads, expanded by default except when (previously) manually collapsed.\nUnread: Only expand thread with unread messages, ignoring and not saving whether they were manually collapsed.": "\u0412\u044B\u043A\u043B: \u043A\u0430\u0436\u0434\u043E\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043E\u0442\u0434\u0435\u043B\u044C\u043D\u043E.\n\u0412\u043A\u043B: \u043F\u0438\u0441\u044C\u043C\u0430 \u0441\u043E\u0431\u0440\u0430\u043D\u044B \u0432 \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0438 \u0440\u0430\u0437\u0432\u0451\u0440\u043D\u0443\u0442\u044B, \u043A\u0440\u043E\u043C\u0435 \u0442\u0435\u0445, \u0447\u0442\u043E \u0432\u044B \u0441\u0432\u0435\u0440\u043D\u0443\u043B\u0438.\n\u041D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0435: \u0440\u0430\u0437\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u0446\u0435\u043F\u043E\u0447\u043A\u0438 \u0441 \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u043C\u0438.",
		"new-label": "\u043D\u043E\u0432\u0430\u044F-\u043C\u0435\u0442\u043A\u0430",
		'New label to add/set on the message(s), must be lower-case, ascii-only, without spaces and without the following special characters: (){%*"\\].': '\u041D\u043E\u0432\u0430\u044F \u043C\u0435\u0442\u043A\u0430: \u0441\u0442\u0440\u043E\u0447\u043D\u044B\u0435 \u043B\u0430\u0442\u0438\u043D\u0441\u043A\u0438\u0435 \u0431\u0443\u043A\u0432\u044B, \u0431\u0435\u0437 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u0432 \u0438 \u0431\u0435\u0437 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432 (){%*"\\].',
		"Server was updated, and webmail wants to reload to get the latest changes, but encountered an error while saving changes your open draft message. Please reload at your earliest convenience.": "\u0421\u0435\u0440\u0432\u0435\u0440 \u043E\u0431\u043D\u043E\u0432\u0438\u043B\u0441\u044F, \u0438 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u0445\u043E\u0447\u0435\u0442 \u043F\u0435\u0440\u0435\u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C\u0441\u044F, \u043D\u043E \u0447\u0435\u0440\u043D\u043E\u0432\u0438\u043A \u0441\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443, \u043A\u043E\u0433\u0434\u0430 \u0431\u0443\u0434\u0435\u0442 \u0443\u0434\u043E\u0431\u043D\u043E.",
		'word "exact match" -notword': '\u0441\u043B\u043E\u0432\u043E "\u0442\u043E\u0447\u043D\u043E\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435" -\u0438\u0441\u043A\u043B\u044E\u0447\u0438\u0442\u044C',
		'"exact match"': '"\u0442\u043E\u0447\u043D\u043E\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435"',
		'todo -done "-dashingname"': '\u043C\u0435\u0442\u043A\u0430 -\u0441\u043D\u044F\u0442\u0430\u044F "-\u0438\u043C\u044F"',
		"Security mechanisms known to be implemented by the recipient domain: ": "\u0417\u0430\u0449\u0438\u0442\u0430, \u043A\u043E\u0442\u043E\u0440\u0443\u044E \u0434\u043E\u043C\u0435\u043D \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F \u0443\u0436\u0435 \u043F\u0440\u043E\u044F\u0432\u043B\u044F\u043B: ",
		"Error fetching security mechanisms known to be implemented by the recipient domain...\n\n": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0443\u0437\u043D\u0430\u0442\u044C \u0437\u0430\u0449\u0438\u0442\u0443 \u0434\u043E\u043C\u0435\u043D\u0430 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F...\n\n",
		"Description of security mechanisms recipient domains may implement:\n1. STARTTLS: Opportunistic (unverified) TLS with STARTTLS, successfully negotiated during the most recent delivery attempt.\n2. MTA-STS: For PKIX/WebPKI-verified TLS.\n3. DNSSEC: MX DNS records are DNSSEC-signed.\n4. DANE: First delivery destination host implements DANE for verified TLS.\n5. RequireTLS: SMTP extension for verified TLS delivery into recipient mailbox, support detected during the most recent delivery attempt.\n\nChecks STARTTLS, DANE and RequireTLS cover the most recently used delivery path, not necessarily all possible delivery paths.\n\nThe bars below the input field indicate implementation status by the recipient domain:\n- Red, not implemented/unsupported\n- Green, implemented/supported\n- Gray, error while determining\n- Absent/white, unknown or skipped (e.g. no previous delivery attempt, or DANE check skipped due to DNSSEC-lookup error)": "\u041A\u0430\u043A\u0443\u044E \u0437\u0430\u0449\u0438\u0442\u0443 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u044F\u0432\u043B\u044F\u0442\u044C \u0434\u043E\u043C\u0435\u043D \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F:\n1. STARTTLS: \u043E\u0431\u044B\u0447\u043D\u044B\u0439 TLS \u0431\u0435\u0437 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438, \u043E\u043D \u0443\u0434\u0430\u043B\u0441\u044F \u043F\u0440\u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0435.\n2. MTA-STS: TLS \u0441 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u043E\u0439 \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442\u0430.\n3. DNSSEC: \u0437\u0430\u043F\u0438\u0441\u0438 MX \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u044B DNSSEC.\n4. DANE: \u043F\u0435\u0440\u0432\u044B\u0439 \u0441\u0435\u0440\u0432\u0435\u0440 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 DANE.\n5. RequireTLS: \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u0438\u0435 SMTP \u0434\u043B\u044F \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u043F\u043E \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u043E\u043C\u0443 TLS, \u043E\u043D\u043E \u0431\u044B\u043B\u043E \u0437\u0430\u043C\u0435\u0447\u0435\u043D\u043E \u043F\u0440\u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0439 \u043F\u043E\u043F\u044B\u0442\u043A\u0435.\n\nSTARTTLS, DANE \u0438 RequireTLS \u043E\u0442\u043D\u043E\u0441\u044F\u0442\u0441\u044F \u043A \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u043C\u0443 \u043F\u0443\u0442\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0438, \u043D\u0435 \u043A\u043E \u0432\u0441\u0435\u043C \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B\u043C.\n\n\u041F\u043E\u043B\u043E\u0441\u043A\u0438 \u043F\u043E\u0434 \u043F\u043E\u043B\u0435\u043C:\n- \u043A\u0440\u0430\u0441\u043D\u0430\u044F, \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F\n- \u0437\u0435\u043B\u0451\u043D\u0430\u044F, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442\u0441\u044F\n- \u0441\u0435\u0440\u0430\u044F, \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438\n- \u043D\u0435\u0442 \u043F\u043E\u043B\u043E\u0441\u043A\u0438, \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E \u0438\u043B\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u0430",
		"How to use TLS for message delivery over SMTP:\n\nDefault: Delivery attempts follow the policies published by the recipient domain: Verification with MTA-STS and/or DANE, or optional opportunistic unverified STARTTLS if the domain does not specify a policy.\n\nWith RequireTLS: For sensitive messages, you may want to require verified TLS. The recipient destination domain SMTP server must support the REQUIRETLS SMTP extension for delivery to succeed. It is automatically chosen when the destination domain mail servers of all recipients are known to support it.\n\nFallback to insecure: If delivery fails due to MTA-STS and/or DANE policies specified by the recipient domain, and the content is not sensitive, you may choose to ignore the recipient domain TLS policies so delivery can succeed.": "\u041A\u0430\u043A \u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u043F\u043E SMTP:\n\n\u041E\u0431\u044B\u0447\u043D\u043E: \u043A\u0430\u043A \u043F\u0440\u043E\u0441\u0438\u0442 \u0434\u043E\u043C\u0435\u043D \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F. \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 MTA-STS \u0438/\u0438\u043B\u0438 DANE, \u043B\u0438\u0431\u043E \u043E\u0431\u044B\u0447\u043D\u044B\u0439 STARTTLS, \u0435\u0441\u043B\u0438 \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0438 \u043D\u0435\u0442.\n\n\u0422\u0440\u0435\u0431\u043E\u0432\u0430\u0442\u044C TLS: \u0434\u043B\u044F \u0432\u0430\u0436\u043D\u043E\u0433\u043E \u043F\u0438\u0441\u044C\u043C\u0430 \u043D\u0443\u0436\u0435\u043D \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u043D\u044B\u0439 TLS. \u0421\u0435\u0440\u0432\u0435\u0440 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u044F \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C REQUIRETLS, \u0438\u043D\u0430\u0447\u0435 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0430 \u043D\u0435 \u0441\u043E\u0441\u0442\u043E\u0438\u0442\u0441\u044F. \u0420\u0435\u0436\u0438\u043C \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C, \u0435\u0441\u043B\u0438 \u044D\u0442\u043E \u0443\u043C\u0435\u044E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u044B \u0432\u0441\u0435\u0445 \u043F\u043E\u043B\u0443\u0447\u0430\u0442\u0435\u043B\u0435\u0439.\n\n\u0420\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u044C \u0431\u0435\u0437 \u0437\u0430\u0449\u0438\u0442\u044B: \u0435\u0441\u043B\u0438 \u0434\u043E\u0441\u0442\u0430\u0432\u043A\u0443 \u043E\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u044E\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 MTA-STS \u0438\u043B\u0438 DANE, \u0430 \u043F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u0441\u0435\u043A\u0440\u0435\u0442\u043D\u043E\u0435, \u044D\u0442\u0438 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u043C\u043E\u0436\u043D\u043E \u043D\u0435 \u0443\u0447\u0438\u0442\u044B\u0432\u0430\u0442\u044C.",
		"Unread": "\u041D\u0435\u043F\u0440\u043E\u0447.",
		"Read": "\u041F\u0440\u043E\u0447.",
		"Mailboxes": "\u041F\u0430\u043F\u043A\u0438",
		"Mail": "\u041F\u043E\u0447\u0442\u0430",
		"Export": "\u042D\u043A\u0441\u043F\u043E\u0440\u0442",
		"Part": "\u0427\u0430\u0441\u0442\u044C",
		"Labels": "\u041C\u0435\u0442\u043A\u0438",
		"Headers": "\u0417\u0430\u0433\u043E\u043B\u043E\u0432\u043A\u0438",
		"Replied": "\u041E\u0442\u0432\u0435\u0447\u0435\u043D\u043E",
		"Deleted": "\u0423\u0434\u0430\u043B\u0435\u043D\u043E",
		"NotJunk": "\u041D\u0435 \u0441\u043F\u0430\u043C",
		"MDNSent": "\u041A\u0432\u0438\u0442\u0430\u043D\u0446\u0438\u044F",
		"Only show messages with the selected label.": "\u0422\u043E\u043B\u044C\u043A\u043E \u043F\u0438\u0441\u044C\u043C\u0430 \u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u043C\u0435\u0442\u043A\u043E\u0439.",
		"Filter and sorting buttons for message list": "\u0424\u0438\u043B\u044C\u0442\u0440\u044B \u0438 \u0441\u043E\u0440\u0442\u0438\u0440\u043E\u0432\u043A\u0430 \u0441\u043F\u0438\u0441\u043A\u0430 \u043F\u0438\u0441\u0435\u043C",
		"Without TLS": "\u0411\u0435\u0437 TLS",
		"With TLS": "\u0421 TLS",
		"Message has a signature": "\u041F\u0438\u0441\u044C\u043C\u043E \u043F\u043E\u0434\u043F\u0438\u0441\u0430\u043D\u043E",
		"Message is encrypted": "\u041F\u0438\u0441\u044C\u043C\u043E \u0437\u0430\u0448\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u043E",
		"Signed": "\u041F\u043E\u0434\u043F\u0438\u0441\u044C",
		"Encrypted": "\u0428\u0438\u0444\u0440\u043E\u0432\u0430\u043D\u0438\u0435",
		"Less": "\u0421\u0432\u0435\u0440\u043D\u0443\u0442\u044C",
		"Details": "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435",
		"Less...": "\u041C\u0435\u043D\u044C\u0448\u0435...",
		"More addresses:\n": "\u0415\u0449\u0451 \u0430\u0434\u0440\u0435\u0441\u0430:\n",
		"Message came in from a forwarded address. Some message authentication policies, like DMARC, were not evaluated.": "\u041F\u0438\u0441\u044C\u043C\u043E \u043F\u0440\u0438\u0448\u043B\u043E \u0441 \u0430\u0434\u0440\u0435\u0441\u0430 \u043F\u0435\u0440\u0435\u0441\u044B\u043B\u043A\u0438. \u0427\u0430\u0441\u0442\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u043E\u043A, \u0432\u043A\u043B\u044E\u0447\u0430\u044F DMARC, \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u043B\u0430\u0441\u044C.",
		"Message was received from a mailing list. Some message authentication policies, like DMARC, were not evaluated.": "\u041F\u0438\u0441\u044C\u043C\u043E \u043F\u0440\u0438\u0448\u043B\u043E \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430 \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438. \u0427\u0430\u0441\u0442\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u043E\u043A, \u0432\u043A\u043B\u044E\u0447\u0430\u044F DMARC, \u043D\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u044F\u043B\u0430\u0441\u044C.",
		"Message received (last hop) without TLS.": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043F\u0440\u043E\u0448\u0451\u043B \u0431\u0435\u0437 TLS.",
		"Message received (last hop) with TLS.": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0439 \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043F\u0440\u043E\u0448\u0451\u043B \u043F\u043E TLS.",
		"Transported with RequireTLS, ensuring TLS along the entire delivery path from sender to recipient, with TLS certificate verification through MTA-STS and/or DANE.": "\u0414\u043E\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E \u0441 RequireTLS. TLS \u0431\u044B\u043B \u043D\u0430 \u0432\u0441\u0451\u043C \u043F\u0443\u0442\u0438, \u0441\u0435\u0440\u0442\u0438\u0444\u0438\u043A\u0430\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D \u0447\u0435\u0440\u0435\u0437 MTA-STS \u0438\u043B\u0438 DANE.",
		"From": "\u041E\u0442",
		"Subject": "\u0422\u0435\u043C\u0430",
		"Schedule": "\u0417\u0430\u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
		"1 day": "1 \u0434\u0435\u043D\u044C",
		"1 week": "1 \u043D\u0435\u0434\u0435\u043B\u044F",
		"1 month": "1 \u043C\u0435\u0441\u044F\u0446",
		"1 year": "1 \u0433\u043E\u0434",
		"and": "\u0438",
		"Account": "\u0410\u043A\u043A\u0430\u0443\u043D\u0442",
		"Layout": "\u041C\u0430\u043A\u0435\u0442",
		"Language": "\u042F\u0437\u044B\u043A",
		"Threads": "\u0426\u0435\u043F\u043E\u0447\u043A\u0438",
		'Register "mailto:" links with the browser or operating system to compose a message in webmail.': "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u0443\u0439\u0442\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 mailto \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438\u043B\u0438 \u0432 \u0441\u0438\u0441\u0442\u0435\u043C\u0435, \u0447\u0442\u043E\u0431\u044B \u043F\u0438\u0441\u0430\u0442\u044C \u043F\u0438\u0441\u044C\u043C\u043E \u043E\u0442\u0441\u044E\u0434\u0430.",
		'word "with space" -notword mb:Inbox f:from@x.example t:rcpt@x.example start:2023-7-1 end:2023-7-8 s:"subject" a:images l:$Forwarded h:Reply-To:other@x.example minsize:500kb': '\u0441\u043B\u043E\u0432\u043E "\u0441 \u043F\u0440\u043E\u0431\u0435\u043B\u043E\u043C" -\u043C\u0438\u043D\u0443\u0441\u0441\u043B\u043E\u0432\u043E mb:Inbox f:from@x.example t:rcpt@x.example start:2023-7-1 end:2023-7-8 s:"\u0442\u0435\u043C\u0430" a:images l:$Forwarded h:Reply-To:other@x.example minsize:500kb',
		"Also search in mailboxes below the selected mailbox.": "\u0418\u0441\u043A\u0430\u0442\u044C \u0442\u0430\u043A\u0436\u0435 \u0432\u043E \u0432\u043B\u043E\u0436\u0435\u043D\u043D\u044B\u0445 \u043F\u0430\u043F\u043A\u0430\u0445.",
		"Flagging": "\u041F\u043E\u043C\u0435\u0442\u043A\u0430 \u0444\u043B\u0430\u0436\u043A\u043E\u043C",
		"Can only drag items in selection.": "\u041F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u0442\u044C \u043C\u043E\u0436\u043D\u043E \u0442\u043E\u043B\u044C\u043A\u043E \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0435 \u043F\u0438\u0441\u044C\u043C\u0430.",
		"Reconnect": "\u041F\u0435\u0440\u0435\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C",
		"Ignore": "\u0421\u043A\u0440\u044B\u0442\u044C",
		"Download": "\u0421\u043A\u0430\u0447\u0430\u0442\u044C",
		"Requesting more messages": "\u0417\u0430\u043F\u0440\u043E\u0441 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u043F\u0438\u0441\u0435\u043C",
		"(unnamed)": "(\u0431\u0435\u0437 \u0438\u043C\u0435\u043D\u0438)",
		"(none)": "(\u043D\u0435\u0442)",
		"; domain ": "; \u0434\u043E\u043C\u0435\u043D ",
		"jane@example.org": "ivan@example.org",
		"Message would have matched a strict DMARC policy.": "\u041F\u0438\u0441\u044C\u043C\u043E \u043F\u0440\u043E\u0448\u043B\u043E \u0431\u044B \u0441\u0442\u0440\u043E\u0433\u0443\u044E \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0443 DMARC.",
		"Message matched DMARC policy of domain.": "\u041F\u0438\u0441\u044C\u043C\u043E \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0435 DMARC \u0434\u043E\u043C\u0435\u043D\u0430.",
		"Domain did not have a DMARC policy, but message would match a relaxed policy if it had existed.": "\u0423 \u0434\u043E\u043C\u0435\u043D\u0430 \u043D\u0435\u0442 \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0438 DMARC, \u043D\u043E \u043F\u0440\u0438 \u043C\u044F\u0433\u043A\u043E\u0439 \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0435 \u043F\u0438\u0441\u044C\u043C\u043E \u043F\u0440\u043E\u0448\u043B\u043E \u0431\u044B.",
		"Message would not pass DMARC policy, but came in through a configured mailing list or forwarding address.": "\u041F\u0438\u0441\u044C\u043C\u043E \u043D\u0435 \u043F\u0440\u043E\u0448\u043B\u043E \u0431\u044B DMARC, \u043D\u043E \u043F\u0440\u0438\u0448\u043B\u043E \u0447\u0435\u0440\u0435\u0437 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A \u0440\u0430\u0441\u0441\u044B\u043B\u043A\u0438 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0441\u044B\u043B\u043A\u0443.",
		"Either domain did not have a DMARC policy, or message did not adhere to it.": "\u0423 \u0434\u043E\u043C\u0435\u043D\u0430 \u043D\u0435\u0442 \u043F\u043E\u043B\u0438\u0442\u0438\u043A\u0438 DMARC, \u043B\u0438\u0431\u043E \u043F\u0438\u0441\u044C\u043C\u043E \u0435\u0439 \u043D\u0435 \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0443\u0435\u0442.",
		"Unknown DMARC verification result.": "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 DMARC \u043D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043D."
	};
	var langPreference = /* @__PURE__ */ __name(() => {
		try {
			const v = localStorage.getItem(langKey);
			if (v === "auto" || v === "en" || v === "ru") {
				return v;
			}
		} catch (err) {
		}
		return "auto";
	}, "langPreference");
	var matchBrowserTag = /* @__PURE__ */ __name((tag) => {
		const t = tag.toLowerCase().trim();
		if (t === "en" || t.startsWith("en-")) {
			return "en";
		}
		if (t === "ru" || t.startsWith("ru-")) {
			return "ru";
		}
		return "";
	}, "matchBrowserTag");
	var browserLang = /* @__PURE__ */ __name(() => {
		const list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
		for (let i = 0; i < list.length; i++) {
			const lang = matchBrowserTag(list[i] || "");
			if (lang) {
				return lang;
			}
		}
		return "en";
	}, "browserLang");
	var resolvedLang = /* @__PURE__ */ __name(() => {
		const pref = langPreference();
		if (pref === "ru" || pref === "en") {
			return pref;
		}
		return browserLang();
	}, "resolvedLang");
	var uiLocale = /* @__PURE__ */ __name(() => resolvedLang() === "ru" ? "ru" : "en", "uiLocale");
	var ui = /* @__PURE__ */ __name((en) => {
		if (resolvedLang() !== "ru") {
			return en;
		}
		const line = ru[en];
		return line === void 0 ? en : line;
	}, "ui");
	document.documentElement.lang = resolvedLang();

	// .js/webmail/lib.js
	var cssStyleDark = dom.style(attr.type("text/css"));
	document.head.prepend(cssStyleDark);
	var styleSheetDark = cssStyleDark.sheet;
	var darkSelector = /* @__PURE__ */ __name((selector) => {
		const parts = [];
		let depth = 0;
		let start = 0;
		for (let i = 0; i < selector.length; i++) {
			const c = selector[i];
			if (c === "(") {
				depth++;
			} else if (c === ")") {
				depth--;
			} else if (c === "," && depth === 0) {
				parts.push(selector.slice(start, i).trim());
				start = i + 1;
			}
		}
		parts.push(selector.slice(start).trim());
		return parts.map((part) => part === ":root" || part === "html" ? '[data-theme="dark"]' : '[data-theme="dark"] ' + part).join(", ");
	}, "darkSelector");
	var cssStyle = dom.style(attr.type("text/css"));
	document.head.prepend(cssStyle);
	var styleSheet = cssStyle.sheet;
	var cssRules = {};
	var ensureCSS = /* @__PURE__ */ __name((selector, styles2, important) => {
		const checkConsistency = location.hostname === "localhost";
		if (cssRules[selector]) {
			if (checkConsistency) {
				const exp = JSON.stringify(styles2);
				if (cssRules[selector] !== exp) {
					throw new Error("duplicate css rule for selector " + selector + ", had " + cssRules[selector] + ", next " + exp);
				}
			}
			return;
		}
		cssRules[selector] = checkConsistency ? JSON.stringify(styles2) : "x";
		const index = styleSheet.cssRules.length;
		styleSheet.insertRule(selector + " {}", index);
		const st = styleSheet.cssRules[index].style;
		let darkst;
		for (let [k, v] of Object.entries(styles2)) {
			if (!k.startsWith("--")) {
				k = k.replace(/[A-Z]/g, (s) => "-" + s.toLowerCase());
			}
			if (Array.isArray(v)) {
				if (v.length !== 2) {
					throw new Error("2 elements required for light/dark mode style, got " + v.length);
				}
				if (!darkst) {
					const darkIndex = styleSheetDark.cssRules.length;
					styleSheetDark.insertRule(darkSelector(selector) + " {}", darkIndex);
					darkst = styleSheetDark.cssRules[darkIndex].style;
				}
				st.setProperty(k, "" + v[0], important ? "important" : "");
				darkst.setProperty(k, "" + v[1], important ? "important" : "");
			} else {
				st.setProperty(k, "" + v, important ? "important" : "");
			}
		}
	}, "ensureCSS");
	var css = /* @__PURE__ */ __name((className, styles2, important) => {
		ensureCSS("." + className, styles2, important);
		return dom._class(className);
	}, "css");
	var themePreferenceKey = "theme-preference";
	var readThemePreference = /* @__PURE__ */ __name(() => {
		try {
			const v = localStorage.getItem(themePreferenceKey);
			if (v === "light" || v === "dark" || v === "auto") {
				return v;
			}
		} catch (err) {
		}
		return "auto";
	}, "readThemePreference");
	var prefersDark = /* @__PURE__ */ __name(() => window.matchMedia("(prefers-color-scheme: dark)").matches, "prefersDark");
	var applyTheme = /* @__PURE__ */ __name((theme) => {
		const resolved = theme === "auto" ? prefersDark() ? "dark" : "light" : theme;
		document.documentElement.setAttribute("data-theme", resolved);
		const toggle = document.getElementById("theme-toggle-switch");
		const autoBtn = document.getElementById("theme-auto");
		if (toggle) {
			toggle.checked = resolved === "dark";
		}
		if (autoBtn) {
			autoBtn.classList.toggle("active", theme === "auto");
			autoBtn.setAttribute("aria-pressed", theme === "auto" ? "true" : "false");
		}
		try {
			localStorage.setItem(themePreferenceKey, theme);
		} catch (err) {
		}
	}, "applyTheme");
	applyTheme(readThemePreference());
	window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
		if (readThemePreference() === "auto") {
			applyTheme("auto");
		}
	});
	window.addEventListener("storage", (e) => {
		if (e.key === themePreferenceKey && (e.newValue === "light" || e.newValue === "dark" || e.newValue === "auto")) {
			applyTheme(e.newValue);
		}
	});
	ensureCSS(":root", {
		"--radius": "8px",
		"--color": ["#2c3035", "#e3e6e9"],
		"--colorMild": ["#555b61", "#b3b9bf"],
		"--colorMilder": ["#868d94", "#828a91"],
		"--backgroundColor": ["#f2f3f5", "#15171a"],
		"--backgroundColorMild": ["#ffffff", "#1e2125"],
		"--backgroundColorMilder": ["#e1e4e8", "#3a4048"],
		"--borderColor": ["#e1e4e8", "#2e333a"],
		"--borderStrong": ["#cdd2d8", "#3a4048"],
		"--mailboxesTopBackgroundColor": ["#2b2f33", "#101214"],
		"--mailboxesSidebarBackground": ["#ffffff", "#1e2125"],
		"--msglistBackgroundColor": ["#f7f8fa", "#24282d"],
		"--boxShadow": ["0 2px 10px rgba(0, 0, 0, 0.08)", "0 2px 12px rgba(0, 0, 0, 0.5)"],
		"--shadowSm": ["0 1px 2px rgba(0, 0, 0, 0.06)", "0 1px 2px rgba(0, 0, 0, 0.3)"],
		"--accent": ["#5b7083", "#7e95a8"],
		"--accentHover": ["#44535f", "#98abbb"],
		"--accentSoft": ["#eef1f4", "#262b31"],
		"--buttonBackground": ["#f7f8fa", "#24282d"],
		"--buttonBorderColor": ["#cdd2d8", "#3a4048"],
		"--buttonHoverBackground": ["#eef1f4", "#262b31"],
		"--buttonPrimaryBackground": ["#5b7083", "#7e95a8"],
		"--buttonPrimaryHover": ["#44535f", "#98abbb"],
		"--navTextColor": ["#c4c9ce", "#c4c9ce"],
		"--navTextHover": ["#ffffff", "#ffffff"],
		"--overlayOpaqueBackgroundColor": ["rgba(242, 243, 245, 0.92)", "rgba(21, 23, 26, 0.92)"],
		"--overlayBackgroundColor": ["rgba(0, 0, 0, 0.25)", "rgba(0, 0, 0, 0.55)"],
		"--popupColor": ["#2c3035", "#e3e6e9"],
		"--popupBackgroundColor": ["#ffffff", "#1e2125"],
		"--popupBorderColor": ["#e1e4e8", "#2e333a"],
		"--floatBorderColor": ["#b4bdc7", "rgba(255, 255, 255, 0.16)"],
		"--floatShadow": ["0 1px 2px rgba(44, 48, 53, 0.06), 0 16px 40px rgba(44, 48, 53, 0.16)", "0 1px 2px rgba(0, 0, 0, 0.45), 0 18px 44px rgba(0, 0, 0, 0.58)"],
		"--highlightBackground": ["#eef1f4", "#262b31"],
		"--highlightBorderColor": ["#5b7083", "#7e95a8"],
		"--highlightBackgroundHover": ["#e1e4e8", "#3a4048"],
		"--mailboxActiveBackground": ["#eef1f4", "#262b31"],
		"--mailboxActiveBorder": ["#5b7083", "#7e95a8"],
		"--mailboxHoverBackgroundColor": ["#f7f8fa", "#24282d"],
		"--msgItemActiveBackground": ["#eef1f4", "#262b31"],
		"--msgItemActiveBorder": ["#5b7083", "#7e95a8"],
		"--msgItemHoverBackgroundColor": ["#f7f8fa", "#24282d"],
		"--msgItemFocusBorderColor": ["#5b7083", "#7e95a8"],
		"--buttonTristateOnBackground": ["rgba(58, 138, 95, 0.16)", "rgba(58, 138, 95, 0.25)"],
		"--buttonTristateOffBackground": ["rgba(179, 71, 58, 0.16)", "rgba(179, 71, 58, 0.25)"],
		"--warningBackgroundColor": ["rgba(185, 129, 12, 0.12)", "rgba(185, 129, 12, 0.2)"],
		"--successBackground": ["rgba(58, 138, 95, 0.12)", "rgba(58, 138, 95, 0.2)"],
		"--emphasisBackground": ["#555b61", "#b3b9bf"],
		// For authentication/security results.
		"--underlineGreen": "#3a8a5f",
		"--underlineRed": "#b3473a",
		"--underlineBlue": "#5b7083",
		"--underlineGrey": "#868d94",
		"--quoted1Color": ["#3f6079", "#8fb0c9"],
		"--quoted2Color": ["#5b7083", "#98abbb"],
		"--quoted3Color": ["#44535f", "#7e95a8"],
		"--scriptSwitchUnderlineColor": ["#b9810c", "#e8b84a"],
		"--linkColor": ["#3f6079", "#8fb0c9"],
		"--linkVisitedColor": ["#27384a", "#b6cee0"]
	});
	var styles = {
		color: "var(--color)",
		colorMild: "var(--colorMild)",
		colorMilder: "var(--colorMilder)",
		backgroundColor: "var(--backgroundColor)",
		backgroundColorMild: "var(--backgroundColorMild)",
		backgroundColorMilder: "var(--backgroundColorMilder)",
		borderColor: "var(--borderColor)",
		borderStrong: "var(--borderStrong)",
		mailboxesTopBackgroundColor: "var(--mailboxesTopBackgroundColor)",
		mailboxesSidebarBackground: "var(--mailboxesSidebarBackground)",
		msglistBackgroundColor: "var(--msglistBackgroundColor)",
		boxShadow: "var(--boxShadow)",
		shadowSm: "var(--shadowSm)",
		radius: "var(--radius)",
		accent: "var(--accent)",
		accentHover: "var(--accentHover)",
		accentSoft: "var(--accentSoft)",
		buttonBackground: "var(--buttonBackground)",
		buttonBorderColor: "var(--buttonBorderColor)",
		buttonHoverBackground: "var(--buttonHoverBackground)",
		buttonPrimaryBackground: "var(--buttonPrimaryBackground)",
		buttonPrimaryHover: "var(--buttonPrimaryHover)",
		navTextColor: "var(--navTextColor)",
		navTextHover: "var(--navTextHover)",
		overlayOpaqueBackgroundColor: "var(--overlayOpaqueBackgroundColor)",
		overlayBackgroundColor: "var(--overlayBackgroundColor)",
		popupColor: "var(--popupColor)",
		popupBackgroundColor: "var(--popupBackgroundColor)",
		popupBorderColor: "var(--popupBorderColor)",
		floatBorderColor: "var(--floatBorderColor)",
		floatShadow: "var(--floatShadow)",
		highlightBackground: "var(--highlightBackground)",
		highlightBorderColor: "var(--highlightBorderColor)",
		highlightBackgroundHover: "var(--highlightBackgroundHover)",
		mailboxActiveBackground: "var(--mailboxActiveBackground)",
		mailboxActiveBorder: "var(--mailboxActiveBorder)",
		mailboxHoverBackgroundColor: "var(--mailboxHoverBackgroundColor)",
		msgItemActiveBackground: "var(--msgItemActiveBackground)",
		msgItemActiveBorder: "var(--msgItemActiveBorder)",
		msgItemHoverBackgroundColor: "var(--msgItemHoverBackgroundColor)",
		msgItemFocusBorderColor: "var(--msgItemFocusBorderColor)",
		buttonTristateOnBackground: "var(--buttonTristateOnBackground)",
		buttonTristateOffBackground: "var(--buttonTristateOffBackground)",
		warningBackgroundColor: "var(--warningBackgroundColor)",
		successBackground: "var(--successBackground)",
		emphasisBackground: "var(--emphasisBackground)",
		// For authentication/security results.
		underlineGreen: "var(--underlineGreen)",
		underlineRed: "var(--underlineRed)",
		underlineBlue: "var(--underlineBlue)",
		underlineGrey: "var(--underlineGrey)",
		quoted1Color: "var(--quoted1Color)",
		quoted2Color: "var(--quoted2Color)",
		quoted3Color: "var(--quoted3Color)",
		scriptSwitchUnderlineColor: "var(--scriptSwitchUnderlineColor)",
		linkColor: "var(--linkColor)",
		linkVisitedColor: "var(--linkVisitedColor)"
	};
	var styleClasses = {
		// For quoted text, with multiple levels of indentations.
		quoted: [
			css("quoted1", { color: styles.quoted1Color }),
			css("quoted2", { color: styles.quoted2Color }),
			css("quoted3", { color: styles.quoted3Color })
		],
		// When text switches between unicode scripts.
		scriptswitch: css("scriptswitch", { textDecoration: "underline 2px", textDecorationColor: styles.scriptSwitchUnderlineColor }),
		textMild: css("textMild", { color: styles.colorMild }),
		// For keywords (also known as flags/labels/tags) on messages.
		keyword: css("keyword", { padding: "2px 8px", borderRadius: "20px", fontWeight: "600", fontSize: "11px", margin: "0 .15em", whiteSpace: "nowrap", background: styles.accentSoft, color: styles.accent, border: "1px solid", borderColor: styles.highlightBorderColor }),
		msgHeaders: css("msgHeaders", { marginBottom: "1ex", width: "100%" })
	};
	ensureCSS(".msgHeaders td", { wordBreak: "break-word" });
	ensureCSS(".keyword.keywordCollapsed", { opacity: 0.75 }), // Generic styling.
	ensureCSS("html", { backgroundColor: "var(--backgroundColor)", color: "var(--color)", lineHeight: "1.55" });
	ensureCSS("body", { fontSize: "14px" });
	ensureCSS("*", { fontSize: "inherit", fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', margin: 0, padding: 0, boxSizing: "border-box" });
	ensureCSS(".mono, .mono *", { fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace" });
	ensureCSS("table td, table th", { padding: ".35em .5em" });
	ensureCSS(".pad", { padding: ".65em" });
	ensureCSS("iframe", { border: 0 });
	ensureCSS("img, embed, video, iframe", { backgroundColor: "white", color: "black" });
	ensureCSS("a", { color: styles.linkColor, textDecoration: "none", transition: "color .2s ease" });
	ensureCSS("a:hover", { color: "var(--linkVisitedColor)" });
	ensureCSS("a:visited", { color: styles.linkVisitedColor });
	ensureCSS("h1, h2, h3", { color: styles.color, fontWeight: "600", lineHeight: "1.25" });
	ensureCSS(".textmulti > *:nth-child(even)", { backgroundColor: ["#f4f4f4", "#141414"] });
	ensureCSS(".textmulti > *", {
		padding: "2ex .5em",
		margin: "-.5em"
		/* compensate pad */
	});
	ensureCSS(".textmulti > *:first-child", { padding: ".5em" });
	var join = /* @__PURE__ */ __name((l, efn) => {
		const r = [];
		const n = l.length;
		for (let i = 0; i < n; i++) {
			r.push(l[i]);
			if (i < n - 1) {
				r.push(efn());
			}
		}
		return r;
	}, "join");
	var displayName = /* @__PURE__ */ __name((s) => {
		const specials = /[()<>\[\]:;@\\,."]/;
		if (specials.test(s)) {
			return '"' + s.replace("\\", "\\\\").replace('"', '\\"') + '"';
		}
		return s;
	}, "displayName");
	var formatDomain = /* @__PURE__ */ __name((dom2) => dom2.Unicode || dom2.ASCII, "formatDomain");
	var formatAddress = /* @__PURE__ */ __name((a) => {
		let s = "<" + a.User + "@" + formatDomain(a.Domain) + ">";
		if (a.Name) {
			s = displayName(a.Name) + " " + s;
		}
		return s;
	}, "formatAddress");
	var formatAddressElem = /* @__PURE__ */ __name((a) => {
		if (!a.Domain.Unicode) {
			return formatAddress(a);
		}
		return dom.span(a.Name ? [displayName(a.Name), " "] : "", "<", a.User, "@", dom.span(attr.title(a.Domain.ASCII), formatDomain(a.Domain)), ">");
	}, "formatAddressElem");
	var formatAddressValidated = /* @__PURE__ */ __name((a, m, use) => {
		const domainText = /* @__PURE__ */ __name((domstr, ascii) => {
			if (!use) {
				return domstr;
			}
			const extra = domstr === ascii ? "" : ui("; domain ") + ascii;
			let name = "";
			let color = "";
			let title = "";
			switch (m.MsgFromValidation) {
				case Validation.ValidationStrict:
					name = "Strict";
					color = styles.underlineGreen;
					title = ui("Message would have matched a strict DMARC policy.");
					break;
				case Validation.ValidationDMARC:
					name = "DMARC";
					color = styles.underlineGreen;
					title = ui("Message matched DMARC policy of domain.");
					break;
				case Validation.ValidationRelaxed:
					name = "Relaxed";
					color = styles.underlineGreen;
					title = ui("Domain did not have a DMARC policy, but message would match a relaxed policy if it had existed.");
					break;
				case Validation.ValidationNone:
					if (m.IsForward || m.IsMailingList) {
						name = "Forwardlist";
						color = styles.underlineBlue;
						title = ui("Message would not pass DMARC policy, but came in through a configured mailing list or forwarding address.");
					} else {
						name = "Bad";
						color = styles.underlineRed;
						title = ui("Either domain did not have a DMARC policy, or message did not adhere to it.");
					}
					break;
				default:
					name = "Unknown";
					title = ui("Unknown DMARC verification result.");
					return dom.span(attr.title(title + extra), domstr);
			}
			return dom.span(attr.title(title + extra), css("addressValidation" + name, { borderBottom: "1.5px solid", borderBottomColor: color, textDecoration: "none" }), domstr);
		}, "domainText");
		let l = [];
		if (a.Name) {
			l.push(a.Name + " ");
		}
		l.push("<" + a.User + "@");
		l.push(domainText(formatDomain(a.Domain), a.Domain.ASCII));
		l.push(">");
		return l;
	}, "formatAddressValidated");
	var formatAddressShort = /* @__PURE__ */ __name((a, junk) => {
		const n = a.Name;
		if (!junk && n && !n.includes("<") && !n.includes("@") && !n.includes(">")) {
			return n;
		}
		return "<" + a.User + "@" + formatDomain(a.Domain) + ">";
	}, "formatAddressShort");
	var addressList = /* @__PURE__ */ __name((allAddrs, l) => {
		if (l.length <= 5 || allAddrs) {
			return dom.span(join(l.map((a) => formatAddressElem(a)), () => ", "));
		}
		let elem = dom.span(join(l.slice(0, 4).map((a) => formatAddressElem(a)), () => ", "), " ", dom.clickbutton(ui("More..."), attr.title(ui("More addresses:\n") + l.slice(4).map((a) => formatAddress(a)).join(",\n")), /* @__PURE__ */ __name(function click() {
			const nelem = dom.span(join(l.map((a) => formatAddressElem(a)), () => ", "), " ", dom.clickbutton(ui("Less..."), /* @__PURE__ */ __name(function click2() {
				elem.replaceWith(addressList(allAddrs, l));
			}, "click")));
			elem.replaceWith(nelem);
			elem = nelem;
		}, "click")));
		return elem;
	}, "addressList");
	var avatarPalette = ["#4c6ef5", "#e8590c", "#2f9e44", "#9c36b5", "#1c7ed6", "#c2255c", "#0ca678", "#f08c00"];
	var avatarColor = /* @__PURE__ */ __name((key) => {
		let h = 0;
		for (const c of key) {
			h = Math.imul(h, 31) + (c.codePointAt(0) || 0);
		}
		const i = (h >>> 0) % avatarPalette.length;
		return avatarPalette[i];
	}, "avatarColor");
	var avatarInitial = /* @__PURE__ */ __name((name, user) => {
		const raw = name.trim() || user || "?";
		const ch = Array.from(raw)[0] || "?";
		return ch.toLocaleUpperCase();
	}, "avatarInitial");
	var senderAvatar = /* @__PURE__ */ __name((a) => {
		const email = a.User && a.Domain.ASCII ? (a.User + "@" + a.Domain.ASCII).trim().toLowerCase() : "";
		const node = dom.span(dom._class("msgFromAvatar"), style({ backgroundColor: avatarColor(email || a.Name || a.User || "?") }), avatarInitial(a.Name, a.User));
		node.setAttribute("aria-hidden", "true");
		if (email && typeof crypto !== "undefined" && crypto.subtle) {
			void crypto.subtle.digest("SHA-256", new TextEncoder().encode(email)).then((buf) => {
				const hash = [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
				const img = document.createElement("img");
				img.className = "msgFromAvatarImg";
				img.alt = "";
				img.referrerPolicy = "no-referrer";
				img.onload = () => {
					node.replaceChildren(img);
					node.classList.add("hasPhoto");
				};
				img.src = "https://www.gravatar.com/avatar/" + hash + "?s=64&d=404";
			}).catch(() => {
			});
		}
		return node;
	}, "senderAvatar");
	ensureCSS(".msgFromPerson", { display: "inline-flex", alignItems: "center", gap: "10px", maxWidth: "100%", verticalAlign: "middle" });
	ensureCSS(".msgFromAvatar", { width: "32px", height: "32px", borderRadius: "50%", flexShrink: "0", display: "inline-flex", alignItems: "center", justifyContent: "center", overflow: "hidden", color: "#fff", fontSize: "14px", fontWeight: "600", lineHeight: "1", userSelect: "none" });
	ensureCSS(".msgFromAvatar.hasPhoto", { backgroundColor: "transparent" });
	ensureCSS(".msgFromAvatarImg", { width: "100%", height: "100%", objectFit: "cover", display: "block" });
	ensureCSS(".msgFromIdentity", { minWidth: "0", display: "flex", flexDirection: "column" });
	var loadMsgheaderView = /* @__PURE__ */ __name((msgheaderelem, mi, moreHeaders, refineKeyword, allAddrs) => {
		const msgenv = mi.Envelope;
		const received = mi.Message.Received;
		const receivedlocal = new Date(received.getTime());
		const msgHeaderFieldStyle = css("msgHeaderField", { textAlign: "right", color: styles.colorMild, whiteSpace: "nowrap", fontSize: "12px" });
		const msgAttrStyle = css("msgAttr", { padding: "0px 0.15em", fontSize: ".9em" });
		dom._kids(
			msgheaderelem,
			// todo: make addresses clickable, start search (keep current mailbox if any)
			dom.tr(dom.td(ui("From:"), msgHeaderFieldStyle), dom.td(style({ width: "100%" }), dom.div(css("msgFromReceivedSpread", { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }), dom.div(css("msgFromLead", { minWidth: "0", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 14px" }), (msgenv.From || []).length === 0 ? dom.span(dom._class("msgFromPerson"), senderAvatar({ Name: "", User: "", Domain: { ASCII: "", Unicode: "" } }), dom.span(dom._class("msgFromName"), ui("(unknown sender)"))) : join((msgenv.From || []).map((a) => {
				const parts = formatAddressValidated(a, mi.Message, (msgenv.From || []).length === 1);
				const detail = typeof parts[0] === "string" && a.Name && parts[0] === a.Name + " " ? parts.slice(1) : parts;
				return dom.span(dom._class("msgFromPerson"), senderAvatar(a), dom.span(dom._class("msgFromIdentity"), dom.span(dom._class("msgFromName"), formatAddressShort(a, !!mi.Message.Junk)), dom.span(dom._class("msgFromDetail"), ...detail)));
			}), () => ", ")), dom.div(attr.title(ui("Received: ") + received.toString() + ";\n" + ui("Date header in message: ") + (msgenv.Date ? msgenv.Date.toString() : ui("(missing/invalid)"))), receivedlocal.toLocaleDateString(uiLocale()) + " " + receivedlocal.toLocaleTimeString(uiLocale(), { hour: "2-digit", minute: "2-digit", second: "2-digit" }))))),
			(msgenv.ReplyTo || []).length === 0 ? [] : dom.tr(dom.td(ui("Reply-To:"), msgHeaderFieldStyle), dom.td(join((msgenv.ReplyTo || []).map((a) => formatAddressElem(a)), () => ", "))),
			dom.tr(dom.td(ui("To:"), msgHeaderFieldStyle), dom.td(addressList(allAddrs, msgenv.To || []))),
			(msgenv.CC || []).length === 0 ? [] : dom.tr(dom.td(ui("Cc:"), msgHeaderFieldStyle), dom.td(addressList(allAddrs, msgenv.CC || []))),
			(msgenv.BCC || []).length === 0 ? [] : dom.tr(dom.td(ui("Bcc:"), msgHeaderFieldStyle), dom.td(addressList(allAddrs, msgenv.BCC || []))),
			dom.tr(dom.td(ui("Subject:"), msgHeaderFieldStyle), dom.td(dom.div(css("msgSubjectAttrsSpread", { display: "flex", justifyContent: "space-between", fontSize: "13px" }), dom.div(msgenv.Subject || ""), dom.div(mi.Message.IsForward ? dom.span(msgAttrStyle, ui("Forwarded"), attr.title(ui("Message came in from a forwarded address. Some message authentication policies, like DMARC, were not evaluated."))) : [], mi.Message.IsMailingList ? dom.span(msgAttrStyle, ui("Mailing list"), attr.title(ui("Message was received from a mailing list. Some message authentication policies, like DMARC, were not evaluated."))) : [], mi.Message.ReceivedTLSVersion === 1 ? dom.span(msgAttrStyle, css("msgAttrNoTLS", { borderBottom: "1.5px solid", borderBottomColor: styles.underlineRed }), ui("Without TLS"), attr.title(ui("Message received (last hop) without TLS."))) : [], mi.Message.ReceivedTLSVersion > 1 && !mi.Message.ReceivedRequireTLS ? dom.span(msgAttrStyle, css("msgAttrTLS", { borderBottom: "1.5px solid", borderBottomColor: styles.underlineGreen }), ui("With TLS"), attr.title(ui("Message received (last hop) with TLS."))) : [], mi.Message.ReceivedRequireTLS ? dom.span(css("msgAttrRequireTLS", { padding: ".1em .3em", fontSize: ".9em", backgroundColor: styles.successBackground, border: "1px solid", borderColor: styles.borderColor, borderRadius: "3px" }), ui("With RequireTLS"), attr.title(ui("Transported with RequireTLS, ensuring TLS along the entire delivery path from sender to recipient, with TLS certificate verification through MTA-STS and/or DANE."))) : [], mi.IsSigned ? dom.span(msgAttrStyle, css("msgAttrSigned", { backgroundColor: styles.colorMild, color: styles.backgroundColorMild, borderRadius: ".15em" }), ui("Message has a signature")) : [], mi.IsEncrypted ? dom.span(msgAttrStyle, css("msgAttrEncrypted", { backgroundColor: styles.colorMild, color: styles.backgroundColorMild, borderRadius: ".15em" }), ui("Message is encrypted")) : [], refineKeyword ? (mi.Message.Keywords || []).map((kw) => dom.clickbutton(styleClasses.keyword, dom._class("keywordButton"), kw, /* @__PURE__ */ __name(async function click() {
				await refineKeyword(kw);
			}, "click"))) : [])))),
			(mi.MoreHeaders || []).map((t) => dom.tr(dom.td(t[0] + ":", msgHeaderFieldStyle), dom.td(t[1]))),
			// Ensure width of all possible additional headers is taken into account, to
			// prevent different layout between messages when not all headers are present.
			dom.tr(dom.td(moreHeaders.map((s) => dom.div(s + ":", msgHeaderFieldStyle, style({ visibility: "hidden", height: 0 })))), dom.td())
		);
	}, "loadMsgheaderView");

	// .js/webmail/msg.js
	var init = /* @__PURE__ */ __name(() => {
		const mi = parser.MessageItem(messageItem);
		document.title = '"' + mi.Envelope.Subject + '"- from ' + ((mi.Envelope.From || []).map((a) => formatAddress(a)).join(", ") || "-") + " (id " + mi.Message.ID + ")";
		let msgattachmentview = dom.div();
		if (mi.Attachments && mi.Attachments.length > 0) {
			dom._kids(msgattachmentview, dom.div(css("msgAttachments", { borderTop: "1px solid", borderTopColor: styles.borderColor }), dom.div(dom._class("pad"), ui("Attachments: "), join(mi.Attachments.map((a) => a.Filename || ui("(unnamed)")), () => ", "))));
		}
		const msgheaderview = dom.tbody();
		loadMsgheaderView(msgheaderview, mi, [], null, true);
		const l = window.location.pathname.split("/");
		const w = l[l.length - 1];
		let iframepath;
		if (w === "msgtext") {
			iframepath = "text";
		} else if (w === "msghtml") {
			iframepath = "html";
		} else if (w === "msghtmlexternal") {
			iframepath = "htmlexternal";
		} else {
			window.alert(ui("Unknown message type ") + w);
			return;
		}
		iframepath += "?sameorigin=true";
		let iframe;
		const page = document.getElementById("page");
		const root = dom.div(dom.div(css("msgMeta", { backgroundColor: styles.backgroundColorMild, borderBottom: "1px solid", borderBottomColor: styles.borderColor }), dom.table(styleClasses.msgHeaders, msgheaderview), msgattachmentview), iframe = dom.iframe(attr.title(ui("Message body.")), attr.src(iframepath), css("msgIframe", { width: "100%", height: "100%" }), /* @__PURE__ */ __name(function load() {
			iframe.style.height = iframe.contentDocument.documentElement.scrollHeight + "px";
			if (window.location.hash === "#print") {
				window.print();
			}
		}, "load")));
		if (typeof moxBeforeDisplay !== "undefined") {
			moxBeforeDisplay(root);
		}
		dom._kids(page, root);
	}, "init");
	try {
		init();
	} catch (err) {
		window.alert(ui("Error: ") + (err.message || "(no message)"));
	}
})();
