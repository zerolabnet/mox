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
	var prop = /* @__PURE__ */ __name((x) => {
		return { _props: x };
	}, "prop");

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
	var Client = class _Client {
		static {
			__name(this, "Client");
		}
		baseURL;
		authState;
		options;
		constructor() {
			this.authState = {};
			this.options = { ...defaultOptions };
			this.baseURL = this.options.baseURL || defaultBaseURL;
		}
		withAuthToken(token) {
			const c = new _Client();
			c.authState.token = token;
			c.options = this.options;
			return c;
		}
		withOptions(options) {
			const c = new _Client();
			c.authState = this.authState;
			c.options = { ...this.options, ...options };
			return c;
		}
		// LoginPrep returns a login token, and also sets it as cookie. Both must be
		// present in the call to Login.
		async LoginPrep() {
			const fn = "LoginPrep";
			const paramTypes = [];
			const returnTypes = [["string"]];
			const params = [];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// Login returns a session token for the credentials, or fails with error code
		// "user:badLogin". Call LoginPrep to get a loginToken.
		async Login(loginToken, username, password) {
			const fn = "Login";
			const paramTypes = [["string"], ["string"], ["string"]];
			const returnTypes = [["CSRFToken"]];
			const params = [loginToken, username, password];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// Logout invalidates the session token.
		async Logout() {
			const fn = "Logout";
			const paramTypes = [];
			const returnTypes = [];
			const params = [];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// Version returns the version, goos and goarch.
		async Version() {
			const fn = "Version";
			const paramTypes = [];
			const returnTypes = [["string"], ["string"], ["string"]];
			const params = [];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// Token returns a single-use token to use for an SSE connection. A token can only
		// be used for a single SSE connection. Tokens are stored in memory for a maximum
		// of 1 minute, with at most 10 unused tokens (the most recently created) per
		// account.
		async Token() {
			const fn = "Token";
			const paramTypes = [];
			const returnTypes = [["string"]];
			const params = [];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// Requests sends a new request for an open SSE connection. Any currently active
		// request for the connection will be canceled, but this is done asynchrously, so
		// the SSE connection may still send results for the previous request. Callers
		// should take care to ignore such results. If req.Cancel is set, no new request is
		// started.
		async Request(req) {
			const fn = "Request";
			const paramTypes = [["Request"]];
			const returnTypes = [];
			const params = [req];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageItem returns a MessageItem for a message.
		async MessageItem(msgID) {
			const fn = "MessageItem";
			const paramTypes = [["int64"]];
			const returnTypes = [["MessageItem"]];
			const params = [msgID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// ParsedMessage returns enough to render the textual body of a message. It is
		// assumed the client already has other fields through MessageItem.
		async ParsedMessage(msgID) {
			const fn = "ParsedMessage";
			const paramTypes = [["int64"]];
			const returnTypes = [["ParsedMessage"]];
			const params = [msgID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// FromAddressSettingsSave saves per-"From"-address settings.
		async FromAddressSettingsSave(fas) {
			const fn = "FromAddressSettingsSave";
			const paramTypes = [["FromAddressSettings"]];
			const returnTypes = [];
			const params = [fas];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageFindMessageID looks up a message by Message-Id header, and returns the ID
		// of the message in storage. Used when opening a previously saved draft message
		// for editing again.
		// If no message is find, zero is returned, not an error.
		async MessageFindMessageID(messageID) {
			const fn = "MessageFindMessageID";
			const paramTypes = [["string"]];
			const returnTypes = [["int64"]];
			const params = [messageID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageCompose composes a message and saves it to the mailbox. Used for
		// saving draft messages.
		async MessageCompose(m, mailboxID) {
			const fn = "MessageCompose";
			const paramTypes = [["ComposeMessage"], ["int64"]];
			const returnTypes = [["int64"]];
			const params = [m, mailboxID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageSubmit sends a message by submitting it the outgoing email queue. The
		// message is sent to all addresses listed in the To, Cc and Bcc addresses, without
		// Bcc message header.
		// 
		// If a Sent mailbox is configured, messages are added to it after submitting
		// to the delivery queue. If Bcc addresses were present, a header is prepended
		// to the message stored in the Sent mailbox.
		async MessageSubmit(m) {
			const fn = "MessageSubmit";
			const paramTypes = [["SubmitMessage"]];
			const returnTypes = [];
			const params = [m];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageMove moves messages to another mailbox. If the message is already in
		// the mailbox an error is returned.
		async MessageMove(messageIDs, mailboxID, markSeen) {
			const fn = "MessageMove";
			const paramTypes = [["[]", "int64"], ["int64"], ["bool"]];
			const returnTypes = [];
			const params = [messageIDs, mailboxID, markSeen];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MessageDelete permanently deletes messages, without moving them to the Trash mailbox.
		async MessageDelete(messageIDs) {
			const fn = "MessageDelete";
			const paramTypes = [["[]", "int64"]];
			const returnTypes = [];
			const params = [messageIDs];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// FlagsAdd adds flags, either system flags like \Seen or custom keywords. The
		// flags should be lower-case, but will be converted and verified.
		async FlagsAdd(messageIDs, flaglist) {
			const fn = "FlagsAdd";
			const paramTypes = [["[]", "int64"], ["[]", "string"]];
			const returnTypes = [];
			const params = [messageIDs, flaglist];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// FlagsClear clears flags, either system flags like \Seen or custom keywords.
		async FlagsClear(messageIDs, flaglist) {
			const fn = "FlagsClear";
			const paramTypes = [["[]", "int64"], ["[]", "string"]];
			const returnTypes = [];
			const params = [messageIDs, flaglist];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxesMarkRead marks all messages in mailboxes as read. Child mailboxes are
		// not automatically included, they must explicitly be included in the list of IDs.
		async MailboxesMarkRead(mailboxIDs) {
			const fn = "MailboxesMarkRead";
			const paramTypes = [["[]", "int64"]];
			const returnTypes = [];
			const params = [mailboxIDs];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxCreate creates a new mailbox.
		async MailboxCreate(name) {
			const fn = "MailboxCreate";
			const paramTypes = [["string"]];
			const returnTypes = [];
			const params = [name];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxDelete deletes a mailbox and all its messages and annotations.
		async MailboxDelete(mailboxID) {
			const fn = "MailboxDelete";
			const paramTypes = [["int64"]];
			const returnTypes = [];
			const params = [mailboxID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxEmpty empties a mailbox, removing all messages from the mailbox, but not
		// its child mailboxes.
		async MailboxEmpty(mailboxID) {
			const fn = "MailboxEmpty";
			const paramTypes = [["int64"]];
			const returnTypes = [];
			const params = [mailboxID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxRename renames a mailbox, possibly moving it to a new parent. The mailbox
		// ID and its messages are unchanged.
		async MailboxRename(mailboxID, newName) {
			const fn = "MailboxRename";
			const paramTypes = [["int64"], ["string"]];
			const returnTypes = [];
			const params = [mailboxID, newName];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// CompleteRecipient returns autocomplete matches for a recipient, returning the
		// matches, most recently used first, and whether this is the full list and further
		// requests for longer prefixes aren't necessary.
		async CompleteRecipient(search) {
			const fn = "CompleteRecipient";
			const paramTypes = [["string"]];
			const returnTypes = [["[]", "string"], ["bool"]];
			const params = [search];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// MailboxSetSpecialUse sets the special use flags of a mailbox.
		async MailboxSetSpecialUse(mb) {
			const fn = "MailboxSetSpecialUse";
			const paramTypes = [["Mailbox"]];
			const returnTypes = [];
			const params = [mb];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// ThreadCollapse saves the ThreadCollapse field for the messages and its
		// children. The messageIDs are typically thread roots. But not all roots
		// (without parent) of a thread need to have the same collapsed state.
		async ThreadCollapse(messageIDs, collapse) {
			const fn = "ThreadCollapse";
			const paramTypes = [["[]", "int64"], ["bool"]];
			const returnTypes = [];
			const params = [messageIDs, collapse];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// ThreadMute saves the ThreadMute field for the messages and their children.
		// If messages are muted, they are also marked collapsed.
		async ThreadMute(messageIDs, mute) {
			const fn = "ThreadMute";
			const paramTypes = [["[]", "int64"], ["bool"]];
			const returnTypes = [];
			const params = [messageIDs, mute];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// RecipientSecurity looks up security properties of the address in the
		// single-address message addressee (as it appears in a To/Cc/Bcc/etc header).
		async RecipientSecurity(messageAddressee) {
			const fn = "RecipientSecurity";
			const paramTypes = [["string"]];
			const returnTypes = [["RecipientSecurity"]];
			const params = [messageAddressee];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// DecodeMIMEWords decodes Q/B-encoded words for a mime headers into UTF-8 text.
		async DecodeMIMEWords(text) {
			const fn = "DecodeMIMEWords";
			const paramTypes = [["string"]];
			const returnTypes = [["string"]];
			const params = [text];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// SettingsSave saves settings, e.g. for composing.
		async SettingsSave(settings2) {
			const fn = "SettingsSave";
			const paramTypes = [["Settings"]];
			const returnTypes = [];
			const params = [settings2];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		async RulesetSuggestMove(msgID, mbSrcID, mbDstID) {
			const fn = "RulesetSuggestMove";
			const paramTypes = [["int64"], ["int64"], ["int64"]];
			const returnTypes = [["string"], ["string"], ["bool"], ["string"], ["nullable", "Ruleset"]];
			const params = [msgID, mbSrcID, mbDstID];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		async RulesetAdd(rcptTo, ruleset) {
			const fn = "RulesetAdd";
			const paramTypes = [["string"], ["Ruleset"]];
			const returnTypes = [];
			const params = [rcptTo, ruleset];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		async RulesetRemove(rcptTo, ruleset) {
			const fn = "RulesetRemove";
			const paramTypes = [["string"], ["Ruleset"]];
			const returnTypes = [];
			const params = [rcptTo, ruleset];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		async RulesetMessageNever(rcptTo, listID, msgFrom, toInbox) {
			const fn = "RulesetMessageNever";
			const paramTypes = [["string"], ["string"], ["string"], ["bool"]];
			const returnTypes = [];
			const params = [rcptTo, listID, msgFrom, toInbox];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		async RulesetMailboxNever(mailboxID, toMailbox) {
			const fn = "RulesetMailboxNever";
			const paramTypes = [["int64"], ["bool"]];
			const returnTypes = [];
			const params = [mailboxID, toMailbox];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
		// SSETypes exists to ensure the generated API contains the types, for use in SSE events.
		async SSETypes() {
			const fn = "SSETypes";
			const paramTypes = [];
			const returnTypes = [["EventStart"], ["EventViewErr"], ["EventViewReset"], ["EventViewMsgs"], ["EventViewChanges"], ["ChangeMsgAdd"], ["ChangeMsgRemove"], ["ChangeMsgFlags"], ["ChangeMsgThread"], ["ChangeMailboxRemove"], ["ChangeMailboxAdd"], ["ChangeMailboxRename"], ["ChangeMailboxCounts"], ["ChangeMailboxSpecialUse"], ["ChangeMailboxKeywords"], ["Flags"]];
			const params = [];
			return await _sherpaCall(this.baseURL, this.authState, { ...this.options }, paramTypes, returnTypes, fn, params);
		}
	};
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
	var _sherpaCall = /* @__PURE__ */ __name(async (baseURL, authState, options, paramTypes, returnTypes, name, params) => {
		if (!options.skipParamCheck) {
			if (params.length !== paramTypes.length) {
				return Promise.reject({ message: "wrong number of parameters in sherpa call, saw " + params.length + " != expected " + paramTypes.length });
			}
			params = params.map((v, index) => verifyArg("params[" + index + "]", v, paramTypes[index], false, false, types, options));
		}
		const simulate = /* @__PURE__ */ __name(async (json2) => {
			const config = JSON.parse(json2 || "null") || {};
			const waitMinMsec = config.waitMinMsec || 0;
			const waitMaxMsec = config.waitMaxMsec || 0;
			const wait = Math.random() * (waitMaxMsec - waitMinMsec);
			const failRate = config.failRate || 0;
			return new Promise((resolve, reject) => {
				if (options.aborter) {
					options.aborter.abort = () => {
						reject({ message: "call to " + name + " aborted by user", code: "sherpa:aborted" });
						reject = resolve = /* @__PURE__ */ __name(() => {
						}, "resolve");
					};
				}
				setTimeout(() => {
					const r = Math.random();
					if (r < failRate) {
						reject({ message: "injected failure on " + name, code: "server:injected" });
					} else {
						resolve();
					}
					reject = resolve = /* @__PURE__ */ __name(() => {
					}, "resolve");
				}, waitMinMsec + wait);
			});
		}, "simulate");
		let json = "";
		try {
			json = window.localStorage.getItem("sherpats-debug") || "";
		} catch (err) {
		}
		if (json) {
			await simulate(json);
		}
		const fn = /* @__PURE__ */ __name((resolve, reject) => {
			let resolve1 = /* @__PURE__ */ __name((v) => {
				resolve(v);
				resolve1 = /* @__PURE__ */ __name(() => {
				}, "resolve1");
				reject1 = /* @__PURE__ */ __name(() => {
				}, "reject1");
			}, "resolve1");
			let reject1 = /* @__PURE__ */ __name((v) => {
				if ((v.code === "user:noAuth" || v.code === "user:badAuth") && options.login) {
					const login2 = options.login;
					if (!authState.loginPromise) {
						authState.loginPromise = new Promise((aresolve, areject) => {
							login2(v.code === "user:badAuth" ? v.message || "" : "").then((token) => {
								authState.token = token;
								authState.loginPromise = void 0;
								aresolve();
							}, (err) => {
								authState.loginPromise = void 0;
								areject(err);
							});
						});
					}
					authState.loginPromise.then(() => {
						fn(resolve, reject);
					}, (err) => {
						reject(err);
					});
					return;
				}
				reject(v);
				resolve1 = /* @__PURE__ */ __name(() => {
				}, "resolve1");
				reject1 = /* @__PURE__ */ __name(() => {
				}, "reject1");
			}, "reject1");
			const url = baseURL + name;
			const req = new window.XMLHttpRequest();
			if (options.aborter) {
				options.aborter.abort = () => {
					req.abort();
					reject1({ code: "sherpa:aborted", message: "request aborted" });
				};
			}
			req.open("POST", url, true);
			if (options.csrfHeader && authState.token) {
				req.setRequestHeader(options.csrfHeader, authState.token);
			}
			if (options.timeoutMsec) {
				req.timeout = options.timeoutMsec;
			}
			req.onload = () => {
				if (req.status !== 200) {
					if (req.status === 404) {
						reject1({ code: "sherpa:badFunction", message: "function does not exist" });
					} else {
						reject1({ code: "sherpa:http", message: "error calling function, HTTP status: " + req.status });
					}
					return;
				}
				let resp;
				try {
					resp = JSON.parse(req.responseText);
				} catch (err) {
					reject1({ code: "sherpa:badResponse", message: "bad JSON from server" });
					return;
				}
				if (resp && resp.error) {
					const err = resp.error;
					reject1({ code: err.code, message: err.message });
					return;
				} else if (!resp || !resp.hasOwnProperty("result")) {
					reject1({ code: "sherpa:badResponse", message: "invalid sherpa response object, missing 'result'" });
					return;
				}
				if (options.skipReturnCheck) {
					resolve1(resp.result);
					return;
				}
				let result = resp.result;
				try {
					if (returnTypes.length === 0) {
						if (result) {
							throw new Error("function " + name + ' returned a value while prototype says it returns "void"');
						}
					} else if (returnTypes.length === 1) {
						result = verifyArg("result", result, returnTypes[0], true, true, types, options);
					} else {
						if (result.length != returnTypes.length) {
							throw new Error("wrong number of values returned by " + name + ", saw " + result.length + " != expected " + returnTypes.length);
						}
						result = result.map((v, index) => verifyArg("result[" + index + "]", v, returnTypes[index], true, true, types, options));
					}
				} catch (err) {
					let errmsg2 = "bad types";
					if (err instanceof Error) {
						errmsg2 = err.message;
					}
					reject1({ code: "sherpa:badTypes", message: errmsg2 });
				}
				resolve1(result);
			};
			req.onerror = () => {
				reject1({ code: "sherpa:connection", message: "connection failed" });
			};
			req.ontimeout = () => {
				reject1({ code: "sherpa:timeout", message: "request timeout" });
			};
			req.setRequestHeader("Content-Type", "application/json");
			try {
				req.send(JSON.stringify({ params }));
			} catch (err) {
				reject1({ code: "sherpa:badData", message: "cannot marshal to JSON" });
			}
		}, "fn");
		return await new Promise(fn);
	}, "_sherpaCall");

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
	var pluralCategory = /* @__PURE__ */ __name((n) => {
		const count = n < 0 ? 0 : Math.trunc(n);
		try {
			return new Intl.PluralRules(uiLocale()).select(count);
		} catch (err) {
			return count === 1 ? "one" : "other";
		}
	}, "pluralCategory");
	var unreadTitle = /* @__PURE__ */ __name((n) => {
		if (resolvedLang() !== "ru") {
			return n + " unread";
		}
		return n + (pluralCategory(n) === "one" ? " \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u043E\u0435" : " \u043D\u0435\u043F\u0440\u043E\u0447\u0438\u0442\u0430\u043D\u043D\u044B\u0445");
	}, "unreadTitle");
	var selectedTitle = /* @__PURE__ */ __name((n) => {
		if (pluralCategory(n) === "one" && resolvedLang() !== "ru") {
			return "1 message selected";
		}
		if (resolvedLang() !== "ru") {
			return n + " messages selected";
		}
		const cat = pluralCategory(n);
		const word = cat === "one" ? "\u043F\u0438\u0441\u044C\u043C\u043E" : cat === "few" ? "\u043F\u0438\u0441\u044C\u043C\u0430" : "\u043F\u0438\u0441\u0435\u043C";
		return "\u0412\u044B\u0431\u0440\u0430\u043D\u043E " + n + " " + word;
	}, "selectedTitle");
	var chooseLang = /* @__PURE__ */ __name((pref) => {
		if (pref === langPreference()) {
			return;
		}
		try {
			localStorage.setItem(langKey, pref);
		} catch (err) {
		}
		location.reload();
	}, "chooseLang");
	var wroteLine = /* @__PURE__ */ __name((when, name) => {
		if (resolvedLang() === "ru") {
			return when + ", " + name + " \u043D\u0430\u043F\u0438\u0441\u0430\u043B(\u0430):\n";
		}
		return "On " + when + ", " + name + " wrote:\n";
	}, "wroteLine");
	var mailboxLabel = /* @__PURE__ */ __name((mb, shown) => {
		const leaf = mb.Name.split("/").pop() || mb.Name;
		const text = shown === void 0 ? leaf : shown;
		if (text !== leaf && text !== mb.Name) {
			return text;
		}
		if (resolvedLang() !== "ru") {
			return text;
		}
		if (mb.Trash) {
			return "\u041A\u043E\u0440\u0437\u0438\u043D\u0430";
		}
		if (mb.Junk) {
			return "\u0421\u043F\u0430\u043C";
		}
		if (mb.Sent) {
			return "\u041E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u0435";
		}
		if (mb.Draft) {
			return "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A\u0438";
		}
		if (mb.Archive) {
			return "\u0410\u0440\u0445\u0438\u0432";
		}
		if (leaf === "Inbox" && mb.Name.split("/")[0] === "Inbox") {
			return "\u0412\u0445\u043E\u0434\u044F\u0449\u0438\u0435";
		}
		return text;
	}, "mailboxLabel");
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
	var themePreference = /* @__PURE__ */ __name(() => readThemePreference(), "themePreference");
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
	var imageTypes = [
		"image/avif",
		"image/webp",
		"image/gif",
		"image/png",
		"image/jpeg",
		"image/apng",
		"image/svg+xml"
	];
	var isImage = /* @__PURE__ */ __name((a) => imageTypes.includes((a.Part.MediaType + "/" + a.Part.MediaSubType).toLowerCase()), "isImage");
	var addLinks = /* @__PURE__ */ __name((text) => {
		const re = RegExp("(?:(http|https)://|mailto:)([:%0-9a-zA-Z._~!$&'/()*+,;=-]+@)?([\\[\\]0-9a-zA-Z.-]+)(:[0-9]+)?([:@%0-9a-zA-Z._~!$&'/()*+,;=-]*)(\\?[:@%0-9a-zA-Z._~!$&'/()*+,;=?-]*)?(#[:@%0-9a-zA-Z._~!$&'/()*+,;=?-]*)?");
		const r = [];
		while (text.length > 0) {
			const l = re.exec(text);
			if (!l) {
				r.push(text);
				break;
			}
			let s = text.substring(0, l.index);
			let url = l[0];
			text = text.substring(l.index + url.length);
			r.push(s);
			if (!text || /^[ \t\r\n]/.test(text)) {
				if (/[)>][!,.:;?]$/.test(url)) {
					text = url.substring(url.length - 2) + text;
					url = url.substring(0, url.length - 2);
				} else if (/[)>!,.:;?]$/.test(url)) {
					text = url.substring(url.length - 1) + text;
					url = url.substring(0, url.length - 1);
				}
			}
			r.push(dom.a(url, attr.href(url), url.startsWith("mailto:") ? [] : [attr.target("_blank"), attr.rel("noopener noreferrer")]));
		}
		return r;
	}, "addLinks");
	var renderText = /* @__PURE__ */ __name((text) => {
		return dom.div(text.split("\n").map((line) => {
			let q = 0;
			for (const c of line) {
				if (c == ">") {
					q++;
				} else if (c !== " ") {
					break;
				}
			}
			if (q == 0) {
				return [addLinks(line), "\n"];
			}
			return dom.div(styleClasses.quoted[q % styleClasses.quoted.length], addLinks(line));
		}));
	}, "renderText");
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
	var formatAddressShort = /* @__PURE__ */ __name((a, junk2) => {
		const n = a.Name;
		if (!junk2 && n && !n.includes("<") && !n.includes("@") && !n.includes(">")) {
			return n;
		}
		return "<" + a.User + "@" + formatDomain(a.Domain) + ">";
	}, "formatAddressShort");
	var formatEmail = /* @__PURE__ */ __name((a) => a.User + "@" + formatDomain(a.Domain), "formatEmail");
	var equalAddress = /* @__PURE__ */ __name((a, b) => {
		return (!a.User || !b.User || a.User === b.User) && a.Domain.ASCII === b.Domain.ASCII;
	}, "equalAddress");
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

	// .js/webmail/icons.js
	var svgIcon = /* @__PURE__ */ __name((width, height, ...pathData) => {
		const svgns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(svgns, "svg");
		svg.setAttributeNS(null, "viewBox", "0 0 " + width + " " + height);
		svg.style.height = "1em";
		svg.style.verticalAlign = "middle";
		svg.style.fill = "currentColor";
		for (const e of pathData) {
			const path = document.createElementNS(svgns, "path");
			path.setAttributeNS(null, "d", e);
			svg.appendChild(path);
		}
		return svg;
	}, "svgIcon");
	var flag = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M5 15.64c2-.87 4.28-.76 6.18.33c1.37.78 2.89 1.18 4.42 1.18c1.12 0 2.24-.21 3.32-.64l1.45-.58A1 1 0 0 0 21 15V4a1 1 0 0 0-1.37-.93l-1.45.58c-1.97.79-4.16.63-6-.42A8.9 8.9 0 0 0 3.77 3l-.21.1a1 1 0 0 0-.55.89v18h2v-6.36ZM5 4.63c2-.87 4.28-.75 6.18.34c2.37 1.36 5.19 1.55 7.74.54l.08-.03v8.85l-.82.33a6.85 6.85 0 0 1-6-.42a8.95 8.95 0 0 0-4.42-1.18c-.93 0-1.86.15-2.75.44V4.63Z"), "flag");
	var forward = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M12.66 3.25c-.29-.26-.72-.33-1.07-.17c-.36.16-.59.52-.59.91v4h-1c-4.41 0-8 3.59-8 8v4c0 .42.27.8.67.94q.165.06.33.06c.3 0 .59-.13.78-.38l1.9-2.37a5.98 5.98 0 0 1 4.69-2.25h.64v4c0 .39.23.75.59.91s.78.1 1.07-.17l9-8c.21-.19.34-.46.34-.75s-.12-.56-.34-.75zM13 17.77V14h-2.64a7.97 7.97 0 0 0-6.25 3l-.12.15V16c0-3.31 2.69-6 6-6h3V6.23L19.48 12l-6.49 5.77Z"), "forward");
	var reply = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M14 8h-1V4c0-.39-.23-.75-.59-.91a.98.98 0 0 0-1.07.17l-9 7.99c-.21.19-.34.46-.34.75s.12.56.34.75l9 8c.29.26.72.33 1.07.17c.36-.16.59-.52.59-.91v-4h.64c1.83 0 3.54.82 4.69 2.25l1.9 2.37a1 1 0 0 0 .78.38q.165 0 .33-.06c.4-.14.67-.52.67-.94v-4c0-4.41-3.59-8-8-8Zm6 9.15l-.12-.15c-1.53-1.91-3.8-3-6.25-3h-2.64v3.77L4.5 12l6.49-5.77V10h3c3.31 0 6 2.69 6 6v1.15Z"), "reply");
	var trash = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zM6 20V8h12v12z", "M9 10h2v8H9zm4 0h2v8h-2z"), "trash");
	var junk = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M17.55 6.17c-.31-.2-.7-.22-1.03-.05c-.32.17-.53.51-.53.88c0 1.63-.5 5-2 5c-.23 0-.63-.13-.78-.41c-.21-.39.02-1.15.61-2.03c2-3-.59-6.12-2.23-7.35a.99.99 0 0 0-.83-.17a.98.98 0 0 0-.66.53C9.52 3.74 8.24 4.79 7.01 5.8c-.63.52-1.22 1-1.73 1.51c-2.27 2.27-2.29 5.57-2.29 5.71c0 4.96 4.04 9 9 9s9-4.04 9-9c0-.19-.04-4.56-3.45-6.83ZM12 20c-3.86 0-7-3.14-7-7c0-.03.04-2.63 1.71-4.3c.44-.44.99-.9 1.58-1.38c1-.82 2.1-1.73 2.92-2.79c.85.89 1.94 2.45.96 3.91c-1.33 1.99-1.12 3.32-.71 4.08c.54 1.02 1.67 1.47 2.54 1.47c1.21 0 2.82-.65 3.59-3.76c.09-.35.16-.71.21-1.05c1.15 1.7 1.19 3.75 1.19 3.8c0 3.86-3.14 7-7 7Z"), "junk");
	var rejects = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M12 2c-4.96 0-9 4.04-9 9v8h.05c.25 1.69 1.69 3 3.45 3c1.17 0 2.07-.42 2.67-1.17c.72.72 1.72 1.17 2.83 1.17s2.11-.46 2.84-1.19c.6.76 1.5 1.19 2.66 1.19c1.93 0 3.5-1.57 3.5-3.5V11c0-4.96-4.04-9-9-9m7 16.5c0 .83-.67 1.5-1.5 1.5c-.45 0-1.5 0-1.5-2v-1h-2v1c0 1.1-.9 2-2 2s-2-.9-2-2v-1H8v1c0 1.85-.77 2-1.5 2c-.83 0-1.5-.67-1.5-1.5V11c0-3.86 3.14-7 7-7s7 3.14 7 7z", "M15.5 9a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3m-7 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3"), "rejects");
	var introbox = /* @__PURE__ */ __name(() => svgIcon(24, 24, "M11 14h2v2h-2zM9.53 7.03C8.87 7.69 8.5 8.57 8.5 9.5h2c0-.4.16-.78.44-1.06c.57-.57 1.55-.57 2.12 0A1.499 1.499 0 0 1 12 11c-.55 0-1 .45-1 1v1h2v-.14c.55-.16 1.06-.46 1.47-.88c.66-.66 1.03-1.54 1.03-2.47s-.36-1.81-1.03-2.47c-1.32-1.32-3.63-1.32-4.95 0Z", "M12 3C6.49 3 2 6.59 2 11c0 2.91 1.9 5.51 5 6.93V21c0 .38.21.72.55.89c.14.07.29.11.45.11c.21 0 .42-.07.6-.2l3.74-2.8c5.36-.14 9.66-3.67 9.66-8s-4.49-8-10-8m0 14c-.22 0-.43.07-.6.2L9 19v-1.73c0-.41-.25-.78-.64-.93C5.67 15.3 4 13.26 4 11c0-3.31 3.59-6 8-6s8 2.69 8 6s-3.59 6-8 6"), "introbox");
	var attachment = /* @__PURE__ */ __name(() => svgIcon(16, 16, "M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0z"), "attachment");

	// .js/webmail/webmail.js
	var reloadURL = URL.parse(window.location.href);
	if (reloadURL?.search.startsWith("?v=")) {
		const l = reloadURL.search.split("&", 2);
		reloadURL.search = l.length === 2 ? "?" + l[1] : "";
		window.location.href = reloadURL.toString();
	}
	var ConsistencyError = class extends Error {
		static {
			__name(this, "ConsistencyError");
		}
	};
	var zindexes = {
		splitter: "1",
		compose: "2",
		searchView: "3",
		searchbar: "4",
		popup: "10",
		popover: "9",
		attachments: "5",
		shortcut: "6",
		login: "7",
		mailboxesDrawer: "8",
		mobileHeader: "8"
	};
	var MOBILE_BP = 1280;
	var viewportWidth = /* @__PURE__ */ __name(() => document.documentElement.clientWidth, "viewportWidth");
	var isMobile = /* @__PURE__ */ __name(() => viewportWidth() <= MOBILE_BP, "isMobile");
	var updateMobileMode = /* @__PURE__ */ __name(() => {
		document.documentElement.classList.toggle("mobile", isMobile());
	}, "updateMobileMode");
	ensureCSS(".button", { display: "inline-block" });
	ensureCSS("button, .button, select", { backgroundColor: styles.buttonBackground, border: "1px solid", borderColor: styles.buttonBorderColor, borderRadius: styles.radius, padding: "6px 12px", fontSize: "13px", cursor: "pointer", transition: "background .2s, border-color .2s, color .2s" });
	ensureCSS("button, .button, select, a.button:visited", { color: styles.color });
	ensureCSS("button.active, .button.active, button.active:hover, .button.active:hover", { backgroundColor: styles.accentSoft, borderColor: styles.accent, color: styles.accent });
	ensureCSS("button:hover:not(:disabled), .button:hover:not(:disabled), select:hover:not(:disabled)", { backgroundColor: styles.buttonHoverBackground, borderColor: styles.accent, textDecoration: "none" });
	ensureCSS("button, .button", { textDecoration: "none" });
	ensureCSS("button:disabled, .button:disabled, select:disabled", { opacity: 0.5, cursor: "default" });
	ensureCSS(".btnPrimary, .btnPrimary:hover:not(:disabled)", { backgroundColor: styles.buttonPrimaryBackground, borderColor: styles.buttonPrimaryBackground, color: "#fff" });
	ensureCSS(".btnPrimary:hover:not(:disabled)", { backgroundColor: styles.buttonPrimaryHover, borderColor: styles.buttonPrimaryHover });
	ensureCSS("input, textarea", { backgroundColor: styles.backgroundColorMild, color: styles.color, border: "1px solid", borderColor: styles.borderStrong, borderRadius: styles.radius, padding: "8px 10px", fontSize: "13px", fontFamily: "inherit", transition: "border-color .2s, background .2s" });
	ensureCSS("input:focus, textarea:focus, select:focus", { outline: "none", borderColor: styles.accent, backgroundColor: styles.backgroundColorMild });
	ensureCSS("input:hover:not(:disabled), textarea:hover:not(:disabled)", { borderColor: styles.accent });
	ensureCSS(".btngroup", { display: "inline-flex", alignItems: "stretch", flexWrap: "nowrap", verticalAlign: "middle" });
	ensureCSS(".btngroup button, .btngroup .button", { borderRadius: 0, borderRightWidth: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", margin: 0, boxSizing: "border-box" });
	ensureCSS(".btngroup button:first-child, .btngroup .button:first-child", { borderRadius: styles.radius + " 0 0 " + styles.radius });
	ensureCSS(".btngroup button:last-child, .btngroup .button:last-child", { borderRadius: "0 " + styles.radius + " " + styles.radius + " 0", borderRightWidth: "1px" });
	ensureCSS(".btngroup button:hover:not(:disabled), .btngroup .button:hover:not(:disabled), .btngroup button.active, .btngroup .button.active, .btngroup button.active:hover, .btngroup .button.active:hover", { position: "relative", zIndex: 1 });
	ensureCSS(".btngroup button:not(:last-child):hover:not(:disabled), .btngroup .button:not(:last-child):hover:not(:disabled), .btngroup button.active:not(:last-child), .btngroup .button.active:not(:last-child), .btngroup button.active:not(:last-child):hover, .btngroup .button.active:not(:last-child):hover", { marginRight: "-1px", borderRightWidth: "1px" });
	css("btnIcon", { minWidth: "26px", width: "26px", height: "26px", padding: 0, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "14px" });
	css("btnCompact", { padding: "2px 8px", lineHeight: 1.3, fontSize: "12px", height: "auto" });
	css("mailboxActionBtn", { padding: "0 6px", height: "26px", minHeight: "26px", minWidth: "26px", lineHeight: 1, fontSize: "12px", alignSelf: "center", verticalAlign: "middle", flexShrink: 0 });
	ensureCSS(".topBar", { display: "flex", flexWrap: "wrap", position: "relative", zIndex: "6", backgroundColor: styles.mailboxesTopBackgroundColor, boxShadow: styles.shadowSm, color: styles.navTextColor });
	ensureCSS(".topBarNav button, .topBarNav .button, .topBarNav select", { backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: styles.navTextColor });
	ensureCSS(".topBarNav button:hover:not(:disabled), .topBarNav .button:hover:not(:disabled), .topBarNav select:hover:not(:disabled)", { backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.25)", color: styles.navTextHover });
	ensureCSS(".topBarNav button.active, .topBarNav .button.active", { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.3)", color: styles.navTextHover });
	ensureCSS(".topBarSearchForm", { display: "flex", alignItems: "stretch", flexGrow: 1, gap: "4px" });
	ensureCSS(".topBarSearchInput", { flex: 1, minWidth: 0, height: "34px", boxSizing: "border-box", backgroundColor: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: styles.navTextHover });
	ensureCSS(".topBarSearchInput::placeholder", { color: styles.navTextColor });
	ensureCSS(".topBarSearchInput:focus", { backgroundColor: "rgba(255,255,255,0.15)", borderColor: "rgba(255,255,255,0.35)" });
	ensureCSS(".topBarSearchInput.searchbarActive", { backgroundColor: "rgba(255,255,255,0.18)", borderColor: "rgba(255,255,255,0.35)" });
	ensureCSS(".topBarSearchClear", { width: "34px", minWidth: "34px", height: "34px", padding: 0, lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.15)", color: styles.navTextColor });
	ensureCSS(".topBarSearchClear:hover:not(:disabled)", { backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.25)", color: styles.navTextHover });
	ensureCSS(".topBar .btnPrimary, .topBar .btnPrimary:hover:not(:disabled)", { backgroundColor: styles.buttonPrimaryBackground, borderColor: styles.buttonPrimaryBackground, color: "#fff" });
	ensureCSS(".topBar .btnPrimary:hover:not(:disabled)", { backgroundColor: styles.buttonPrimaryHover, borderColor: styles.buttonPrimaryHover });
	ensureCSS(".topBar a", { color: styles.navTextColor });
	ensureCSS(".topBar a:hover", { color: styles.navTextHover });
	ensureCSS(".topBarNav span, .topBar .status", { color: styles.navTextColor });
	ensureCSS(".searchOverlay", { position: "fixed", left: 0, right: 0, top: 0, bottom: 0, zIndex: zindexes.compose, backgroundColor: styles.overlayBackgroundColor });
	ensureCSS(".searchOverlay .searchContent", { position: "fixed", left: 0, right: 0, bottom: 0, top: "auto", width: "100%", maxWidth: "none", maxHeight: "min(90dvh, calc(100dvh - 3.5em))", zIndex: 1, color: styles.popupColor, backgroundColor: styles.popupBackgroundColor, border: "1px solid", borderColor: styles.floatBorderColor, borderRadius: "12px 12px 0 0", boxShadow: styles.floatShadow, boxSizing: "border-box", padding: 0, overflow: "hidden", display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto" });
	ensureCSS("html:not(.mobile) .searchOverlay .searchContent", { left: "50%", right: "auto", transform: "translateX(-50%)", width: "min(50em, calc(100vw - 2em))" });
	ensureCSS(".searchOverlay .searchContent .dialogBody", { padding: "16px" });
	ensureCSS(".searchOverlay .searchContent .dialogFooter", { padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0))" });
	ensureCSS(".searchContent, .searchContent .searchTable", { backgroundColor: styles.popupBackgroundColor });
	ensureCSS(".searchContent label", { color: styles.color, fontWeight: 600, fontSize: "13px" });
	ensureCSS(".searchTable tr", { display: "block", marginBottom: "1em" });
	ensureCSS(".searchTable td", { display: "block", width: "100%", padding: "0", boxSizing: "border-box" });
	ensureCSS(".searchTable td:first-child", { width: "auto", paddingBottom: ".35em", fontWeight: 600, fontSize: "12px", color: styles.colorMild, whiteSpace: "normal" });
	ensureCSS(".searchTable input, .searchTable select", { width: "100%", maxWidth: "100%", boxSizing: "border-box" });
	ensureCSS(".searchMailboxKids", { marginTop: "8px" });
	ensureCSS(".searchMailboxKids label", { display: "flex", alignItems: "flex-start", gap: "10px", fontWeight: 400, fontSize: "13px", lineHeight: "1.4", textAlign: "left" });
	ensureCSS(".searchMailboxKids input[type=checkbox]", { width: "auto", flexShrink: 0, marginTop: "3px" });
	ensureCSS(".searchKeywordButtons", { display: "flex", flexWrap: "wrap", gap: "6px", lineHeight: "normal", marginBottom: "8px" });
	ensureCSS(".searchKeywordButtons button", { flex: "0 1 auto" });
	ensureCSS(".searchTable .searchSizeRow", { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" });
	ensureCSS(".searchTable .searchSizeRow input", { flex: "1 1 8em", width: "auto", minWidth: 0 });
	ensureCSS(".searchContent input, .searchContent select, .searchContent textarea", { boxSizing: "border-box", backgroundColor: styles.backgroundColorMild, color: styles.color, border: "1px solid", borderColor: styles.borderStrong });
	ensureCSS(".searchContent input:not([type=checkbox]):not([type=radio])", { minHeight: "38px", height: "38px" });
	ensureCSS(".searchContent select", { minHeight: "38px", height: "38px" });
	ensureCSS(".searchContent input:focus, .searchContent select:focus, .searchContent textarea:focus", { borderColor: styles.accent, backgroundColor: styles.backgroundColorMild, outline: "none" });
	ensureCSS(".searchContent .dialogBody button, .searchContent .dialogBody .button", { backgroundColor: styles.buttonBackground, borderColor: styles.buttonBorderColor, color: styles.color });
	ensureCSS(".searchContent .dialogBody button:hover:not(:disabled), .searchContent .dialogBody .button:hover:not(:disabled)", { backgroundColor: styles.buttonHoverBackground, borderColor: styles.accent, color: styles.color });
	ensureCSS(".searchContent .dialogBody button.active, .searchContent .dialogBody .button.active", { backgroundColor: styles.accentSoft, borderColor: styles.accent, color: styles.accent });
	ensureCSS(".searchContent .btngroup", { flexWrap: "wrap", gap: "6px" });
	ensureCSS(".searchRadios", { display: "flex", flexWrap: "wrap", gap: "8px 12px" });
	ensureCSS(".searchRadios label", { display: "inline-flex", alignItems: "center", gap: "4px", fontWeight: 400, whiteSpace: "nowrap" });
	ensureCSS(".searchDateRow", { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" });
	ensureCSS(".searchDateRow input[type=date]", { flex: "1 1 9em", minWidth: 0 });
	ensureCSS(".searchDateRow input[type=time]", { flex: "0 0 5.5em" });
	ensureCSS(".searchDateRow > span", { color: styles.colorMild, padding: "0 2px" });
	ensureCSS(".searchDateRow .btnIcon", { width: "38px", minWidth: "38px", height: "38px", minHeight: "38px", padding: 0, boxSizing: "border-box" });
	ensureCSS(".attachmentsDownloadHeader .button", { flexShrink: 0 });
	ensureCSS(".refineBar", { display: "flex", alignItems: "center", flexWrap: "nowrap", gap: "6px", minWidth: 0, flex: "1 1 auto", overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" });
	ensureCSS(".refineBar .refineTitle", { display: "inline", margin: 0, whiteSpace: "nowrap", position: "sticky", left: 0, zIndex: 1, flexShrink: 0, backgroundColor: styles.backgroundColorMild });
	ensureCSS(".refineBar .btngroup", { flexWrap: "nowrap", flexShrink: 0 });
	ensureCSS(".msgListFilterSortingControls", { display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto", flexShrink: 0, minWidth: 0 });
	ensureCSS(".threadModeLabel", { color: styles.colorMild, whiteSpace: "nowrap" });
	ensureCSS(".msgListFilterSortingControls .threadModeSelect", { width: "6.6em", maxWidth: "6.6em" });
	ensureCSS(".msgListFilterSortingControls > span:empty", { display: "none" });
	ensureCSS(".mailboxesRegion", { width: "100%", boxSizing: "border-box", backgroundColor: styles.mailboxesSidebarBackground });
	ensureCSS(".mailboxesBox > .pad", { padding: "14px 10px" });
	ensureCSS(".mailboxesList", { display: "flex", flexDirection: "column", gap: "3px" });
	ensureCSS(".mailboxesHeader", { display: "flex", alignItems: "center", width: "100%", boxSizing: "border-box", marginBottom: 0, padding: "6px 6px 6px 8px" });
	ensureCSS(".mailboxesHeader .mailboxesTitle", { margin: 0, flex: "1 1 auto", minWidth: 0 });
	ensureCSS(".mailboxesHeader .mailboxActionBtn", { marginLeft: "auto", flexShrink: 0 });
	ensureCSS(".mailboxItem", { display: "block", width: "100%", boxSizing: "border-box", padding: "10px 12px", margin: 0, cursor: "pointer", borderRadius: "8px", userSelect: "none", color: styles.colorMild, fontWeight: "600", fontSize: "0.92rem", transition: "background .15s, color .15s" });
	ensureCSS(".mailboxItem svg", { width: "18px", height: "18px", flex: "none", opacity: ".8" });
	ensureCSS(".mailboxItem.active svg", { opacity: "1" });
	ensureCSS(".mailboxIcon", { display: "inline-flex", flex: "none", alignItems: "center" });
	ensureCSS(".mailbox", { display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 0, flex: 1, minWidth: 0, width: "100%", boxSizing: "border-box", gap: "11px" });
	ensureCSS(".mailboxName", { flex: "1 1 auto", minWidth: 0, paddingRight: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "inherit" });
	ensureCSS(".mailboxActions", { display: "flex", alignItems: "center", gap: "4px", flexShrink: 0, marginLeft: "auto", paddingRight: "2px" });
	ensureCSS(".mailboxUnreadBadge", { display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: "18px", height: "18px", padding: "0 6px", borderRadius: "9px", fontSize: "11px", fontWeight: 600, lineHeight: 1, flexShrink: 0, boxSizing: "border-box", backgroundColor: styles.buttonPrimaryBackground, color: "#fff" });
	ensureCSS(".mailboxUnreadBadge.isEmpty", { display: "none" });
	ensureCSS(".mailboxItem.active .mailboxUnreadBadge", { backgroundColor: styles.buttonPrimaryBackground, color: "#fff" });
	ensureCSS(".topBarComposeDesktop", { display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box", padding: ".45em .5em", flex: "none" });
	ensureCSS(".topBarComposeDesktop .btnPrimary", { width: "100%", boxSizing: "border-box", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "7px" });
	ensureCSS(".mailboxItem.active .mailboxActionBtn", { backgroundColor: "transparent", borderColor: styles.accent });
	ensureCSS(".msgItem", { display: "flex", flexDirection: "row", flexWrap: "nowrap", alignItems: "flex-start", position: "relative", width: "100%", boxSizing: "border-box", userSelect: "none", cursor: "pointer", border: "1px solid transparent", borderLeft: "3px solid transparent", borderBottom: "1px solid", borderBottomColor: styles.borderColor, borderRadius: 0, margin: 0, transition: "background .15s, border-color .15s" });
	ensureCSS(".msgItem .scriptswitch", { textDecoration: "none" });
	ensureCSS(".msgItemCell", { padding: "4px 6px", boxSizing: "border-box" });
	ensureCSS(".msgItemFlags", { flex: "0 0 auto", flexShrink: 0, boxSizing: "border-box", overflow: "hidden" });
	ensureCSS(".msgThreadToggle", { display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", minWidth: "22px", height: "22px", padding: "0 5px", lineHeight: "1", fontSize: "12px", fontWeight: "600", flexShrink: "0" });
	ensureCSS(".msgThreadToggle svg", { width: "14px", height: "14px", display: "block" });
	ensureCSS(".msgItemAge", { flex: "0 0 auto", flexShrink: 0, boxSizing: "border-box", whiteSpace: "nowrap", overflow: "hidden" });
	ensureCSS(".msgItemMain", { display: "flex", flexDirection: "column", gap: "1px", overflow: "hidden", position: "relative", minWidth: 0, flex: "1 1 auto" });
	ensureCSS(".msgItemFromRow", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", minWidth: 0 });
	ensureCSS(".msgItemSubjectRow", { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px", minWidth: 0 });
	ensureCSS(".msgItemPreviewRow", { minWidth: 0 });
	ensureCSS(".msgItemFromText", { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0, flex: 1 });
	ensureCSS(".msgItemSubjectText", { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "12px", color: styles.colorMild, minWidth: 0, flex: 1 });
	ensureCSS(".msgItemPreviewText", { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: "11px", color: styles.colorMilder, minWidth: 0 });
	ensureCSS(".msgItemUnread .msgItemFromText", { fontWeight: "bold", color: styles.color });
	ensureCSS(".msgItemUnread .msgItemSubjectText", { color: styles.color });
	ensureCSS(".inlineAttachmentsLine", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: ".5em" });
	ensureCSS(".msgModeBar", { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" });
	var keywordButtonStyle = css("keywordButton", { cursor: "pointer" });
	ensureCSS(".keywordButton:hover:not(:disabled)", { backgroundColor: styles.highlightBackgroundHover });
	ensureCSS(".topBarStatusRow", { display: "flex", flexGrow: 1, alignItems: "center", minWidth: 0 });
	ensureCSS(".topBarSearchRow", { display: "flex", alignItems: "center", gap: "6px", flex: "1 1 auto", minWidth: 0 });
	ensureCSS("html:not(.mobile) .topBar", { flexWrap: "nowrap", alignItems: "center" });
	ensureCSS("html:not(.mobile) .topBarStatusRow", { flexGrow: 0, flexShrink: 0, minWidth: 0, justifyContent: "flex-end" });
	ensureCSS("html:not(.mobile) .topBarStatusRow .status", { flex: "1 1 auto", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
	ensureCSS("html:not(.mobile) .topBarNav", { display: "flex", flexWrap: "nowrap", flexShrink: 0, gap: "6px", justifyContent: "flex-end", alignItems: "center", paddingLeft: "1em" });
	ensureCSS(".theme-toggle-container", { display: "flex", alignItems: "center", alignSelf: "center", gap: 0, flex: "none", flexShrink: 0 });
	ensureCSS("html:not(.mobile) .theme-toggle-container", { marginLeft: "10px", paddingLeft: "14px", borderLeft: "1px solid rgba(255,255,255,.15)" });
	ensureCSS("html.mobile .theme-toggle-container", { marginLeft: "auto", paddingLeft: 0, borderLeft: 0 });
	ensureCSS(".theme-toggle", { position: "relative", display: "inline-block", width: "3.26rem", height: "1.61rem", flex: "none", cursor: "pointer" });
	ensureCSS(".theme-toggle input", { position: "absolute", opacity: 0, width: 0, height: 0, minHeight: 0, margin: 0, padding: 0, border: 0 });
	ensureCSS(".theme-toggle .slider", { position: "absolute", cursor: "pointer", inset: 0, background: "rgba(255,255,255,.16)", borderRadius: "999px", transition: "background .25s" });
	ensureCSS(".theme-toggle .slider::before", { content: '""', position: "absolute", width: "1.25rem", height: "1.25rem", left: ".18rem", top: ".18rem", background: "#fff", borderRadius: "50%", transition: "transform .25s", zIndex: 1 });
	ensureCSS(".theme-toggle input:checked + .slider::before", { transform: "translateX(1.65rem)" });
	ensureCSS(".theme-toggle input:focus-visible + .slider", { outline: "2px solid #fff", outlineOffset: "2px" });
	ensureCSS(".theme-slot", { position: "absolute", top: ".18rem", width: "1.25rem", height: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,.72)", pointerEvents: "none", zIndex: 2 });
	ensureCSS(".theme-sun", { left: ".18rem" });
	ensureCSS(".theme-moon", { right: ".18rem" });
	ensureCSS(".theme-slot .icon", { width: ".78rem", height: ".78rem" });
	ensureCSS(".theme-toggle input:not(:checked) + .slider .theme-sun, .theme-toggle input:checked + .slider .theme-moon", { color: "#1c2430" });
	ensureCSS(".theme-toggle-container button.theme-auto, .theme-toggle-container button.theme-auto:hover, .theme-toggle-container button.theme-auto:hover:not(:disabled), .theme-toggle-container button.theme-auto.active, .theme-toggle-container button.theme-auto.active:hover", { display: "flex", alignItems: "center", justifyContent: "center", width: "1.61rem", minWidth: "1.61rem", height: "1.61rem", minHeight: "1.61rem", padding: 0, border: 0, borderRadius: "999px", backgroundColor: "transparent", boxShadow: "none", color: "rgba(255,255,255,.45)", cursor: "pointer", lineHeight: 1 });
	ensureCSS(".theme-toggle-container button.theme-auto:hover, .theme-toggle-container button.theme-auto:hover:not(:disabled), .theme-toggle-container button.theme-auto.active, .theme-toggle-container button.theme-auto.active:hover", { color: "#fff", backgroundColor: "transparent", borderColor: "transparent" });
	ensureCSS(".theme-auto .icon", { width: ".95rem", height: ".95rem" });
	ensureCSS(".theme-auto:focus-visible", { outline: "2px solid #fff", outlineOffset: "2px" });
	ensureCSS(".theme-toggle-container button.lang-choice, .theme-toggle-container button.lang-choice:hover, .theme-toggle-container button.lang-choice:hover:not(:disabled)", { display: "flex", alignItems: "center", justifyContent: "center", width: "1.61rem", minWidth: "1.61rem", height: "1.61rem", minHeight: "1.61rem", padding: 0, border: 0, borderRadius: "999px", backgroundColor: "transparent", boxShadow: "none", color: "rgba(255,255,255,.45)", cursor: "pointer", lineHeight: 1 });
	ensureCSS(".theme-toggle-container button.lang-choice:hover, .theme-toggle-container button.lang-choice:hover:not(:disabled)", { color: "#fff", backgroundColor: "transparent", borderColor: "transparent" });
	ensureCSS(".theme-toggle-container .lang-choice .icon", { width: ".95rem", height: ".95rem" });
	ensureCSS(".theme-toggle-container .lang-choice:focus-visible", { outline: "2px solid #fff", outlineOffset: "2px" });
	ensureCSS(".theme-switch-group", { display: "flex", alignItems: "center", gap: ".45rem", marginLeft: "14px", paddingLeft: "14px", borderLeft: "1px solid rgba(255,255,255,.15)" });
	ensureCSS(".nav-account", { position: "relative" });
	ensureCSS(".nav-account button.nav-account-toggle, .nav-account button.nav-account-toggle:hover:not(:disabled)", { display: "inline-flex", alignItems: "center", gap: ".5rem", padding: "8px 12px", border: 0, borderRadius: "8px", backgroundColor: "transparent", boxShadow: "none", color: "inherit", cursor: "pointer" });
	ensureCSS(".nav-account button.nav-account-toggle:hover:not(:disabled)", { backgroundColor: "rgba(255,255,255,.08)", color: "#fff" });
	ensureCSS(".nav-account-label", { maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
	ensureCSS(".nav-account .icon", { width: "1.15em", height: "1.15em", flex: "none" });
	ensureCSS(".nav-account .icon.nav-account-caret", { width: "1em", height: "1em", opacity: ".7" });
	ensureCSS(".nav-account-menu", { display: "none", flexDirection: "column", position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: "30", width: "max-content", padding: "6px 0", backgroundColor: "#353a40", color: "inherit", border: "1px solid rgba(255,255,255,.12)", borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,.28)" });
	ensureCSS(".nav-account.open .nav-account-menu", { display: "flex" });
	ensureCSS(".nav-account button.nav-account-item, .nav-account button.nav-account-item:hover:not(:disabled), a.nav-account-item, a.nav-account-item:hover:not(:disabled)", { display: "flex", alignItems: "center", alignSelf: "stretch", gap: "10px", width: "auto", boxSizing: "border-box", textAlign: "left", textDecoration: "none", whiteSpace: "nowrap", padding: "9px 14px", border: 0, borderRadius: 0, backgroundColor: "transparent", boxShadow: "none", color: "inherit", fontSize: "13px", cursor: "pointer" });
	ensureCSS(".nav-account button.nav-account-item:hover:not(:disabled), a.nav-account-item:hover:not(:disabled)", { backgroundColor: "rgba(255,255,255,.08)", color: "#fff" });
	ensureCSS(".nav-account-item[hidden]", { display: "none" });
	ensureCSS(".nav-account-divider", { height: "1px", margin: "6px 0", backgroundColor: "rgba(255,255,255,.12)" });
	ensureCSS(".nav-account-layouts", { display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "8px 14px" });
	ensureCSS(".nav-account button.nav-layout, .nav-account button.nav-layout:hover:not(:disabled)", { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "2rem", height: "2rem", padding: 0, border: 0, borderRadius: "8px", backgroundColor: "transparent", boxShadow: "none", color: "rgba(255,255,255,.45)", cursor: "pointer" });
	ensureCSS(".nav-account button.nav-layout:hover:not(:disabled)", { color: "#fff", backgroundColor: "rgba(255,255,255,.08)" });
	ensureCSS(".nav-account button.nav-layout.isOn, .nav-account button.nav-layout.isOn:hover:not(:disabled)", { color: "#fff", backgroundColor: "rgba(255,255,255,.16)" });
	ensureCSS(".nav-account button.nav-layout .icon", { width: "1.15em", height: "1.15em" });
	ensureCSS(".msgActionRow", { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", padding: ".45em .65em" });
	ensureCSS(".msgActionRow button", { flex: "0 1 auto" });
	ensureCSS(".msgListActionBar", { display: "none", flexWrap: "wrap", gap: "8px", alignItems: "center", padding: ".45em .65em", borderBottom: "1px solid", borderBottomColor: styles.borderColor, backgroundColor: styles.backgroundColorMild });
	ensureCSS(".msgListActionBar.isOpen", { display: "flex" });
	ensureCSS(".msgItemFlagBtn, .msgItemFlagBtn:hover:not(:disabled)", { flexShrink: "0", padding: "2px", lineHeight: "1", minWidth: "22px", backgroundColor: "transparent", borderColor: "transparent", boxShadow: "none", color: styles.colorMild });
	ensureCSS(".msgItemFlagBtn.isOn, .msgItemFlagBtn.isOn:hover:not(:disabled)", { backgroundColor: "transparent", borderColor: "transparent", color: ["#d1242f", "#ff5c5c"] });
	ensureCSS(".msgItemFlagBtn.isOn .msgItemFlagCloth", { fill: "currentColor" });
	ensureCSS(".msgItemHoverActions", { display: "none", position: "absolute", right: "6px", top: "6px", gap: "4px", zIndex: "1", padding: "4px", backgroundColor: ["inherit", styles.popupBackgroundColor], border: "1px solid", borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow });
	ensureCSS("html:not(.mobile) .msgItem:hover .msgItemHoverActions", { display: "flex" });
	ensureCSS(".msgItemHoverActions button", { padding: "2px 8px", lineHeight: "1.3", fontSize: "12px" });
	ensureCSS(".msgItemHoverActions button.msgItemHoverIcon", { width: "28px", minWidth: "28px", height: "28px", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", backgroundColor: "transparent", border: 0, boxShadow: "none", lineHeight: 1, color: "inherit" });
	ensureCSS(".msgItemHoverActions button.msgItemHoverIcon:hover:not(:disabled)", { backgroundColor: "transparent", borderColor: "transparent", color: styles.accent });
	ensureCSS(".msgItemHoverActions button.msgItemHoverIcon.msgItemHoverDanger, .msgItemHoverActions button.msgItemHoverIcon.msgItemHoverDanger:hover:not(:disabled)", { backgroundColor: "transparent", borderColor: "transparent", color: ["#d1242f", "#ff5c5c"] });
	ensureCSS(".msgFromName", { fontSize: "16px", fontWeight: "600", lineHeight: "1.3" });
	ensureCSS(".msgFromDetail", { fontSize: "12px", color: styles.colorMild });
	ensureCSS(".moveUndoBar", { position: "absolute", right: "12px", bottom: "12px", zIndex: zindexes.popup, display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", backgroundColor: styles.popupBackgroundColor, color: styles.popupColor, border: "1px solid", borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow, maxWidth: "calc(100% - 24px)" });
	ensureCSS(".moveUndoBarFloating", { position: "fixed", right: "12px", bottom: "max(12px, env(safe-area-inset-bottom))" });
	ensureCSS(".topBarMessageRow", { display: "none", alignItems: "center", gap: "6px", flex: "1 1 100%", minWidth: 0 });
	ensureCSS(".topBarMobileOverflow", { minWidth: "44px", minHeight: "44px", padding: "0 10px", flexShrink: 0 });
	ensureCSS(".topBarMobileOnly", { display: "none" });
	ensureCSS(".mailboxesBackdrop", { display: "none" });
	ensureCSS(".mobileMsgHeader", { display: "none" });
	ensureCSS(".mobileMsgPane", { position: "absolute", left: 0, right: 0, top: 0, bottom: 0 });
	ensureCSS("html.mobile .topBar", { flexWrap: "nowrap", alignItems: "stretch", paddingTop: "env(safe-area-inset-top, 0)" });
	ensureCSS("html.mobile .topBar > .pad", { padding: ".4em .5em", boxSizing: "border-box" });
	ensureCSS("html.mobile .topBarSearchRow, html.mobile.mobile-pane-message .topBarMessageRow", { flex: "1 1 100%", width: "100%", maxWidth: "100%" });
	ensureCSS("html.mobile.mobile-pane-list .topBarMessageRow", { display: "none" });
	ensureCSS("html.mobile .mailboxesListMsgBox", { backgroundColor: styles.backgroundColorMild });
	ensureCSS("html.mobile .topBarComposeDesktop", { display: "none" });
	ensureCSS("html.mobile .topBarMobileOnly", { display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 });
	ensureCSS("html.mobile .topBarNavDesktop", { display: "none" });
	ensureCSS("html.mobile .topBarStatusRow", { display: "none" });
	ensureCSS("html.mobile .topBarSearchRow", { flex: "1 1 auto", minWidth: 0 });
	ensureCSS("html.mobile.mobile-pane-message .topBarSearchRow", { display: "none" });
	ensureCSS("html.mobile.mobile-pane-message .topBarMessageRow", { display: "flex" });
	ensureCSS("html.mobile .topBarMessageTitle", { flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: "600", color: styles.navTextHover });
	ensureCSS("html.mobile .topBarSearchForm", { flex: 1, minWidth: 0 });
	ensureCSS("html.mobile .searchbarBox", { flex: "1 1 0", minWidth: 0, display: "flex" });
	ensureCSS("html.mobile .searchbarBox search", { display: "flex", flex: "1 1 0", minWidth: 0, width: "100%" });
	ensureCSS("html.mobile .topBarSearchInput", { flex: 1, minWidth: 0, width: "100%", height: "38px" });
	ensureCSS("html.mobile .topBarSearchClear", { width: "38px", minWidth: "38px", height: "38px" });
	ensureCSS("html.mobile .topBarMenuBtn", { minWidth: "40px", minHeight: "40px", padding: "0", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center" });
	ensureCSS(".topBarMenuIcon", { display: "inline-flex", alignItems: "center", justifyContent: "center", width: "18px", height: "18px", flexShrink: 0 });
	ensureCSS(".searchDatePresets", { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" });
	ensureCSS("html.mobile .topBarMobileCompose, html.mobile .topBarMessageBack, html.mobile .topBarMobileOverflow", { minWidth: "40px", minHeight: "40px", padding: "0 8px", flexShrink: 0, fontSize: "20px", lineHeight: 1, display: "inline-flex", alignItems: "center", justifyContent: "center" });
	ensureCSS("html.mobile .topBarMessageTitle, html.mobile .topBarMessageTitle .scriptswitch", { textDecoration: "none" });
	ensureCSS("html.mobile .mailboxesSidebar", { position: "fixed", left: 0, top: 0, bottom: 0, width: "min(280px, 85vw)", maxWidth: "85vw", zIndex: zindexes.mailboxesDrawer, transform: "translateX(-100%)", transition: "transform .2s ease", boxShadow: styles.boxShadow, visibility: "visible" });
	ensureCSS("html.mobile.mailboxes-drawer-open .mailboxesSidebar", { transform: "translateX(0)" });
	ensureCSS("html.mobile .mailboxesBackdrop", { display: "none", position: "fixed", left: 0, right: 0, top: 0, bottom: 0, zIndex: "7", backgroundColor: styles.overlayBackgroundColor });
	ensureCSS("html.mobile.mailboxes-drawer-open .mailboxesBackdrop", { display: "block" });
	ensureCSS("html.mobile .mailboxessplitElem, html.mobile .mailboxesListGrab", { display: "none" });
	ensureCSS("html.mobile .listMsgBox", { left: "0", right: "0" });
	ensureCSS("html.mobile .listMsgLeftRightGrab, html.mobile .listMsgTopBottomGrab", { display: "none" });
	ensureCSS("html.mobile .msgItemFlagsOffset, html.mobile .msgItemMainOffset", { display: "none" });
	ensureCSS("html.mobile.mobile-pane-list .layoutRight, html.mobile.mobile-pane-list .layoutBottom", { display: "none" });
	ensureCSS("html.mobile.mobile-pane-list .layoutLeft, html.mobile.mobile-pane-list .layoutTop", { left: "0", right: "0", width: "auto", height: "auto", bottom: "0", top: "0" });
	ensureCSS("html.mobile.mobile-pane-message .layoutLeft, html.mobile.mobile-pane-message .layoutTop", { display: "none" });
	ensureCSS("html.mobile.mobile-pane-message .layoutRight, html.mobile.mobile-pane-message .layoutBottom", { left: "0", right: "0", top: "0", bottom: "0", width: "auto", height: "auto" });
	ensureCSS("html.mobile .mobileMsgPane", { display: "flex", flexDirection: "column", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 });
	ensureCSS("html.mobile .mobileMsgPane .msgElem", { position: "relative", flex: "1 1 auto", minHeight: 0, borderLeftWidth: 0, display: "flex", flexDirection: "column" });
	ensureCSS("html.mobile .msgViewRoot", { position: "relative", flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column" });
	ensureCSS("html.mobile .msgmeta", { maxHeight: "none", flexShrink: 0, overflowY: "visible", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .scrollparent", { flex: "1 1 auto", minHeight: 0 });
	ensureCSS("html.mobile .msgListFilterSorting", { padding: ".5em .65em" });
	ensureCSS("html.mobile .refineBar", { flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", gap: "6px" });
	ensureCSS("html.mobile .refineBar .btngroup", { flexWrap: "nowrap", flexShrink: 0 });
	ensureCSS("html.mobile .refineBar .btngroup button", { minHeight: "36px", padding: "6px 10px" });
	ensureCSS("html.mobile .msgListFilterSortingControls", { marginLeft: "auto", flexShrink: 0 });
	ensureCSS("html.mobile .msgListFilterSortingControls select, html.mobile .msgListFilterSortingControls button", { minHeight: "36px", padding: "6px 10px", boxSizing: "border-box", fontSize: "13px" });
	ensureCSS("html.mobile .msgListFilterSortingControls .threadModeSelect", { width: "6.6em", minWidth: 0, maxWidth: "6.6em" });
	ensureCSS("html.mobile .msgListFilterSortingControls .threadSortBtn", { minWidth: "36px", padding: "6px 8px" });
	ensureCSS("html.mobile .msgItemCell", { padding: "8px 6px", minHeight: "44px" });
	ensureCSS("html.mobile .msgItemAge", { overflow: "visible", paddingRight: "2px" });
	ensureCSS(".msgMobileSummary", { display: "none" });
	ensureCSS(".msgMobileSummaryTop", { display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px" });
	ensureCSS(".msgMobileSummaryFrom", { flex: "1 1 auto", minWidth: 0, fontWeight: "600", fontSize: "14px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
	ensureCSS(".msgMobileSummaryDate", { flexShrink: 0, fontSize: "12px", color: styles.colorMild, whiteSpace: "nowrap" });
	ensureCSS(".msgMobileSummaryMeta", { display: "flex", alignItems: "center", gap: "8px", marginTop: "2px", minWidth: 0 });
	ensureCSS(".msgMobileSummaryTo", { flex: "1 1 auto", minWidth: 0, fontSize: "12px", color: styles.colorMild, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" });
	ensureCSS(".msgMobileDetailsToggle", { flexShrink: 0, padding: "2px 6px", fontSize: "12px", lineHeight: 1.3, minHeight: "auto", color: styles.accent });
	ensureCSS(".msgMobileSummaryChips", { display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" });
	ensureCSS(".msgMobileSummaryChip", { fontSize: "10px", padding: "1px 5px", borderRadius: "3px", backgroundColor: styles.accentSoft, color: styles.colorMild });
	ensureCSS("button.msgMobileSummaryChip", { border: "none", minHeight: "auto", lineHeight: 1.4, cursor: "pointer" });
	ensureCSS("button.msgMobileSummaryChip:hover:not(:disabled)", { backgroundColor: styles.highlightBackground });
	ensureCSS("html.mobile .msgbuttonMobile", { padding: "6px 10px", borderBottom: "1px solid", borderBottomColor: styles.borderColor, flexShrink: 0 });
	ensureCSS("html.mobile .msgbuttonMobile .msgActionRow", { flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", gap: "6px", padding: 0 });
	ensureCSS("html.mobile .msgbuttonMobile .msgActionRow button", { flexShrink: 0, minHeight: "32px", padding: "5px 12px", fontSize: "13px" });
	ensureCSS(".menuList", { backgroundColor: styles.popupBackgroundColor, border: "1px solid", borderColor: styles.popupBorderColor, borderRadius: styles.radius, boxShadow: styles.boxShadow, overflow: "hidden", minWidth: "12em", color: styles.popupColor });
	ensureCSS(".menuList.menuListFit", { display: "inline-grid", minWidth: 0, width: "max-content", verticalAlign: "top" });
	ensureCSS(".menuList.menuListFit .menuItem", { display: "grid" });
	ensureCSS(".menuList.menuListFit .menuItem button", { width: "auto", justifySelf: "stretch", whiteSpace: "nowrap", boxSizing: "border-box" });
	ensureCSS(".menuItem", { borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS(".menuItem:last-child", { borderBottom: "none" });
	ensureCSS(".menuItem button", { display: "block", width: "100%", boxSizing: "border-box", textAlign: "left", border: "none", borderRadius: 0, backgroundColor: "transparent", padding: "10px 14px", minHeight: "40px", fontSize: "13px", color: styles.color });
	ensureCSS(".menuItem button:hover:not(:disabled)", { backgroundColor: styles.buttonHoverBackground });
	ensureCSS(".menuList.langMenu", { padding: "4px", minWidth: "168px" });
	ensureCSS(".menuList.langMenu .menuItem", { borderBottom: "none" });
	ensureCSS(".menuList.langMenu .menuItem button", { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", width: "100%", minHeight: "36px", margin: 0, padding: "0 10px", border: 0, borderRadius: styles.radius, backgroundColor: "transparent", fontSize: ".875rem", textAlign: "start" });
	ensureCSS(".menuList.langMenu .menuItem button:hover:not(:disabled), .menuList.langMenu .menuItem button:focus-visible", { backgroundColor: styles.accentSoft, color: styles.color });
	ensureCSS('.menuList.langMenu .menuItem button[aria-current="true"]', { fontWeight: "600" });
	ensureCSS('.menuList.langMenu .menuItem button[aria-current="true"]::after', { content: '""', width: "5px", height: "9px", marginTop: "-2px", flex: "none", borderStyle: "solid", borderColor: styles.accent, borderWidth: "0 2px 2px 0", transform: "rotate(45deg)" });
	ensureCSS(".menuList.langMenu .langRule", { height: "1px", margin: "4px 6px", backgroundColor: styles.borderColor });
	ensureCSS(".menuItem button.active, .menuItem button.active:hover:not(:disabled)", { display: "flex", alignItems: "center", gap: "8px", backgroundColor: styles.accentSoft, color: styles.accent });
	ensureCSS(".menuItem button .icon", { width: "1em", height: "1em", flex: "none" });
	ensureCSS(".menuItem > label", { display: "flex", alignItems: "center", gap: "8px", width: "100%", boxSizing: "border-box", padding: "10px 14px", fontWeight: 400, cursor: "pointer" });
	ensureCSS(".menuItemForm", { padding: "10px 14px" });
	ensureCSS(".popupContent", { padding: "0", display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0, backgroundColor: styles.popupBackgroundColor, boxShadow: styles.floatShadow, border: "1px solid", borderColor: styles.floatBorderColor, borderRadius: styles.radius, maxWidth: "95vw", maxHeight: "min(90dvh, calc(100dvh - 2em))", boxSizing: "border-box" });
	ensureCSS(".popupOverlay > .popupContent", { minHeight: 0, flexShrink: 0, margin: "auto" });
	ensureCSS(".popupContent > .dialogPanel, .popupContent > .dialogForm.dialogPanel", { flex: "1 1 auto", minHeight: 0, maxHeight: "100%", overflow: "hidden" });
	ensureCSS(".dialogPanel", { display: "grid", gridTemplateRows: "auto minmax(0, 1fr) auto", overflow: "hidden", width: "min(50em, calc(100vw - 2em))", minWidth: "0", maxWidth: "100%", maxHeight: "min(90dvh, calc(100dvh - 2em))", boxSizing: "border-box", backgroundColor: styles.popupBackgroundColor });
	ensureCSS(".dialogForm", { margin: 0, padding: 0, border: "none" });
	ensureCSS(".helpPanel", { width: "min(84em, calc(100vw - 2em))", minWidth: "0", maxWidth: "100%" });
	ensureCSS(".helpColumns", { display: "flex", flexWrap: "wrap", gap: "1.5em", alignItems: "flex-start", minWidth: 0 });
	ensureCSS(".helpColumns > div", { flex: "1 1 22em", minWidth: "min(100%, 22em)", maxWidth: "100%", boxSizing: "border-box" });
	ensureCSS(".helpPanel table", { width: "100%", borderCollapse: "collapse" });
	ensureCSS(".helpPanel h2", { margin: "0 0 .5em 0", fontSize: "1rem", fontWeight: 600 });
	ensureCSS(".helpPanel td", { padding: ".2em .5em .2em 0", verticalAlign: "top" });
	ensureCSS(".helpPanel td:first-child", { whiteSpace: "nowrap", fontFamily: "monospace", fontSize: "12px", color: styles.colorMild });
	ensureCSS(".internalsPanel", { width: "min(90em, calc(100vw - 2em))", minWidth: "min(32em, calc(100vw - 2em))" });
	ensureCSS(".internalsColumns", { display: "flex", flexWrap: "wrap", gap: "1.25em", alignItems: "flex-start" });
	ensureCSS(".internalsColumns > div", { flex: "1 1 18em", minWidth: "min(100%, 18em)" });
	ensureCSS(".internalsColumns h2", { margin: "0 0 .5em 0", fontSize: "1rem", fontWeight: 600 });
	ensureCSS(".internalsList", { listStyle: "disc", margin: "0 0 0 1em", padding: 0 });
	ensureCSS(".internalsPre", { whiteSpace: "pre-wrap", tabSize: 4, fontFamily: "monospace", fontSize: "12px", lineHeight: 1.45, backgroundColor: styles.backgroundColorMild, padding: "12px", borderRadius: styles.radius, border: "1px solid", borderColor: styles.borderColor, overflowX: "auto", margin: 0 });
	ensureCSS(".errorPanel", { width: "min(60em, calc(100vw - 2em))", minWidth: "min(32em, calc(100vw - 2em))" });
	ensureCSS(".errorPre", { whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "12px", lineHeight: 1.45, backgroundColor: styles.backgroundColorMild, padding: "12px", borderRadius: styles.radius, border: "1px solid", borderColor: styles.borderColor, overflowX: "auto", margin: "0 0 1em 0" });
	ensureCSS(".errorPanel p", { margin: "0 0 .75em 0", lineHeight: 1.45 });
	ensureCSS(".dialogHeader", { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor, gridRow: "1", minWidth: 0, flexShrink: 0 });
	ensureCSS(".dialogHeader h1", { margin: 0, fontSize: "1.1rem", fontWeight: 600, color: styles.color, flex: "1 1 auto", minWidth: 0, lineHeight: 1.3 });
	ensureCSS(".dialogHeader .btnIcon", { flexShrink: 0 });
	ensureCSS(".dialogBody", { gridRow: "2", padding: "16px", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", minHeight: 0, maxHeight: "100%" });
	ensureCSS(".dialogBody > fieldset", { display: "flex", flexDirection: "column", gap: "14px", border: "none", margin: 0, padding: 0, minWidth: 0 });
	ensureCSS(".dialogField", { display: "flex", flexDirection: "column", gap: "6px" });
	ensureCSS(".dialogFieldLabel", { fontSize: "12px", fontWeight: 600, color: styles.colorMild });
	ensureCSS(".dialogFieldHint", { fontSize: "12px", color: styles.colorMilder, fontStyle: "italic", lineHeight: 1.4, margin: 0 });
	ensureCSS(".dialogField input:not([type=checkbox]):not([type=radio]), .dialogField select, .dialogField textarea", { width: "100%", boxSizing: "border-box" });
	ensureCSS(".dialogField textarea", { minHeight: "5em", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 });
	ensureCSS(".dialogField select", { minHeight: "34px" });
	ensureCSS(".dialogCheckField", { display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", lineHeight: 1.4, fontWeight: 400, color: styles.color, cursor: "pointer" });
	ensureCSS(".dialogCheckField input[type=checkbox]", { width: "auto", flexShrink: 0, marginTop: "3px" });
	ensureCSS(".dialogSection", { paddingTop: "12px", borderTop: "1px solid", borderTopColor: styles.borderColor, display: "flex", flexDirection: "column", gap: "10px" });
	ensureCSS(".dialogSectionTitle", { fontSize: "12px", fontWeight: 600, color: styles.colorMild, textTransform: "uppercase", letterSpacing: ".04em" });
	ensureCSS(".dialogSectionText", { fontSize: "13px", lineHeight: 1.45, color: styles.color, margin: 0 });
	ensureCSS(".dialogActions", { display: "flex", flexWrap: "wrap", gap: "8px" });
	ensureCSS(".dialogActionsStack", { display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" });
	ensureCSS(".dialogActionsStack button", { width: "100%", textAlign: "left", boxSizing: "border-box" });
	ensureCSS(".confirmPanel p", { margin: "0", lineHeight: 1.45, maxWidth: "36em" });
	ensureCSS(".dialogFooter", { gridRow: "3", display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", padding: "12px 16px", borderTop: "1px solid", borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, flexShrink: 0 });
	ensureCSS(".dialogFooter button", { minWidth: "6em", padding: "8px 20px", boxSizing: "border-box" });
	ensureCSS(".dialogFooter .btnPrimary, .dialogFooter button[type=submit]", { fontWeight: 600 });
	ensureCSS("html:not(.mobile) .popupOverlay", { padding: "1em", boxSizing: "border-box", overflowY: "auto", alignItems: "flex-start" });
	ensureCSS("html.mobile .popupOverlay", { alignItems: "flex-end", padding: 0, overflowY: "hidden" });
	ensureCSS("html.mobile .popupContent", { width: "100%", maxWidth: "100%", borderRadius: "12px 12px 0 0", maxHeight: "min(90dvh, calc(100dvh - 2em))" });
	ensureCSS("html.mobile .dialogPanel", { width: "100%", minWidth: "0", maxHeight: "min(90dvh, calc(100dvh - 2em))" });
	ensureCSS("html.mobile .helpPanel, html.mobile .internalsPanel, html.mobile .errorPanel", { width: "100%" });
	ensureCSS("html.mobile .dialogFooter", { padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0))" });
	ensureCSS("html.mobile .dialogFooter button", { flex: "1 1 auto", minHeight: "44px" });
	ensureCSS("html.mobile .dialogField input:not([type=checkbox]):not([type=radio]), html.mobile .dialogField select, html.mobile .dialogField textarea", { minHeight: "44px" });
	ensureCSS("html.mobile .dialogField textarea", { minHeight: "6em" });
	ensureCSS("html.mobile .msgmeta", { borderBottomWidth: "1px", borderBottomColor: styles.borderColor, flexShrink: 0 });
	ensureCSS("html.mobile .msgMobileSummary", { display: "block", padding: "8px 12px 6px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .msgHeaderDetails:not(.expanded) .msgHeaders, html.mobile .msgHeaderDetails:not(.expanded) .msgHeaderExtra", { display: "none" });
	ensureCSS("html.mobile .msgHeaderDetails.expanded .msgHeaders", { fontSize: "13px", padding: "8px 12px 4px" });
	ensureCSS("html.mobile .msgHeaderDetails.expanded .msgHeaders tr", { display: "block", marginBottom: ".35em" });
	ensureCSS("html.mobile .msgHeaderDetails.expanded .msgHeaders td", { display: "block", textAlign: "left", padding: "0" });
	ensureCSS("html.mobile .msgHeaderDetails.expanded .msgHeaders td:first-child", { fontWeight: "600", color: styles.colorMild, marginBottom: "1px", fontSize: "11px" });
	ensureCSS("html.mobile .msgHeaderDetails.expanded .msgFromReceivedSpread", { flexDirection: "column", alignItems: "flex-start", gap: "2px" });
	ensureCSS("html.mobile .msgmeta .pad", { padding: "6px 10px" });
	ensureCSS("html.mobile .msgModeBar", { flexWrap: "nowrap", overflowX: "auto", WebkitOverflowScrolling: "touch", gap: "6px", alignItems: "center" });
	ensureCSS("html.mobile .msgModeBar .btngroup", { flexShrink: 0 });
	ensureCSS("html.mobile .msgModeBar .btngroup button", { padding: "5px 10px", fontSize: "12px", whiteSpace: "nowrap" });
	ensureCSS("html.mobile .inlineAttachmentsLine", { fontSize: "12px" });
	ensureCSS("html.mobile .headerBodySeparator", { display: "none" });
	ensureCSS("html:not(.mobile) .composePopup", { padding: "0", width: "min(42em, calc(100vw - 2rem))", minWidth: "0", maxWidth: "calc(100vw - 2rem)", overflow: "hidden", border: "1px solid", borderColor: styles.floatBorderColor, boxShadow: styles.floatShadow });
	ensureCSS("html:not(.mobile) .composeForm", { minHeight: 0, overflow: "hidden" });
	ensureCSS("html:not(.mobile) .composeFields", { flex: "1 1 auto", minHeight: 0, overflowY: "auto", gap: "0", border: "none", margin: 0, padding: 0 });
	ensureCSS("html:not(.mobile) .composeFields table", { borderCollapse: "separate", borderSpacing: "0" });
	ensureCSS("html:not(.mobile) .composeFields table tr td", { padding: "7px 16px", verticalAlign: "middle" });
	ensureCSS("html:not(.mobile) .composeFields table tr td:first-child", { width: "5.5em", paddingRight: "10px", whiteSpace: "nowrap" });
	ensureCSS("html:not(.mobile) .composeTextMild", { textAlign: "right", fontSize: "13px", fontWeight: 500, color: styles.colorMild });
	ensureCSS("html:not(.mobile) .composeHeaderRow td", { paddingTop: "12px", paddingBottom: "12px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html:not(.mobile) .composeFromBar", { display: "flex", alignItems: "center", gap: "12px", width: "100%", minWidth: 0 });
	ensureCSS("html:not(.mobile) .composeFromLabel", { display: "flex", alignItems: "center", gap: "8px", flex: "1 1 auto", minWidth: 0, margin: 0, fontSize: "13px", fontWeight: 500, color: styles.colorMild });
	ensureCSS("html:not(.mobile) .composeFromLabel select", { flex: "1 1 auto", minWidth: "10em", minHeight: "34px", maxWidth: "100%" });
	ensureCSS("html:not(.mobile) .composeHeaderActions", { display: "flex", alignItems: "center", gap: "8px", flexShrink: 0, marginLeft: "auto" });
	ensureCSS("html:not(.mobile) .composeToolbarRow td", { paddingTop: "8px", paddingBottom: "10px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html:not(.mobile) .composeToolbarBtns", { display: "flex", flexWrap: "wrap", gap: "6px" });
	ensureCSS("html:not(.mobile) .composeToolbarBtns button", { padding: "4px 10px", fontSize: "12px", lineHeight: 1.3, height: "auto", minHeight: "28px" });
	ensureCSS("html:not(.mobile) .composeAddrRow td", { borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html:not(.mobile) .composeFields table tr.composeSubjectRow td", { borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html:not(.mobile) .composeCell > span", { display: "flex", alignItems: "stretch", gap: "6px", width: "100%", marginBottom: "4px" });
	ensureCSS("html:not(.mobile) .composeCell > span:last-child", { marginBottom: 0 });
	ensureCSS("html:not(.mobile) .composeCell .autosize", { flex: "1 1 0", minWidth: 0, display: "grid", width: "100%", maxWidth: "100%" });
	ensureCSS("html:not(.mobile) .composeCell input, html:not(.mobile) .composeFields table tr.composeSubjectRow input", { width: "100%", boxSizing: "border-box", height: "34px", minHeight: "34px", padding: "0 10px" });
	ensureCSS("html:not(.mobile) .composeCell .btnIcon", { width: "34px", minWidth: "34px", height: "34px", minHeight: "34px", flexShrink: 0, alignSelf: "auto", boxSizing: "border-box" });
	ensureCSS("html:not(.mobile) .composeFields textarea.mono", { display: "block", flex: "1 1 auto", minHeight: "14em", margin: "0", padding: "12px 16px", width: "100%", boxSizing: "border-box", border: "none", borderTop: "1px solid", borderBottom: "1px solid", borderColor: styles.borderColor, borderRadius: 0, resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 });
	ensureCSS("html:not(.mobile) .composeMeta", { padding: "12px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor, display: "flex", flexDirection: "column", gap: "10px", backgroundColor: styles.backgroundColor });
	ensureCSS("html:not(.mobile) .composeMeta label", { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px", margin: 0, fontSize: "13px", fontWeight: 500, color: styles.colorMild });
	ensureCSS("html:not(.mobile) .composeMeta label select, html:not(.mobile) .composeMeta input[type=file]", { flex: "1 1 12em", minWidth: 0, maxWidth: "100%" });
	ensureCSS("html:not(.mobile) .composeSchedulePresets", { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" });
	ensureCSS("html:not(.mobile) .composeFooter", { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", padding: "12px 16px", borderTop: "1px solid", borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, flexShrink: 0 });
	ensureCSS("html:not(.mobile) .composeFooter button[type=submit]", { minWidth: "6em", padding: "8px 20px", fontWeight: 600 });
	ensureCSS("html.mobile .composePopupMobile", { position: "fixed", inset: "0", width: "100%", height: "100%", maxWidth: "none", minWidth: "0", borderRadius: "0", border: "none", boxShadow: "none", margin: "0", padding: "0", paddingTop: "env(safe-area-inset-top, 0)", paddingBottom: "env(safe-area-inset-bottom, 0)", boxSizing: "border-box", display: "flex", flexDirection: "column" });
	ensureCSS("html.mobile .composePopupMobile .composeResizeGrab", { display: "none" });
	ensureCSS("html.mobile .composePopupMobile .composeForm", { flex: "1 1 auto", minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden", padding: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeFields", { flex: "1 1 auto", minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: "0", border: "none", margin: 0, padding: 0 });
	ensureCSS("html.mobile .composePopupMobile table, html.mobile .composePopupMobile tr, html.mobile .composePopupMobile td", { display: "block", width: "100%", boxSizing: "border-box" });
	ensureCSS("html.mobile .composePopupMobile .composeFields table tr", { marginBottom: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeTextMild", { textAlign: "left", display: "block", marginBottom: "4px", fontWeight: 600, fontSize: "12px", color: styles.colorMild });
	ensureCSS("html.mobile .composePopupMobile .composeHeaderRow", { padding: "12px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .composePopupMobile .composeHeaderRow td", { padding: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeFromBar", { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "10px" });
	ensureCSS("html.mobile .composePopupMobile .composeFromLabel", { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "6px", margin: 0, fontSize: "12px", fontWeight: 600, color: styles.colorMild });
	ensureCSS("html.mobile .composePopupMobile .composeFromLabel select", { width: "100%", maxWidth: "100%", minHeight: "44px", height: "44px", boxSizing: "border-box" });
	ensureCSS("html.mobile .composePopupMobile .composeHeaderActions", { display: "flex", gap: "8px" });
	ensureCSS("html.mobile .composePopupMobile .composeHeaderActions button", { flex: "1 1 0", minHeight: "44px" });
	ensureCSS("html.mobile .composePopupMobile .composeToolbarRow", { padding: "10px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .composePopupMobile .composeToolbarRow td", { padding: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeToolbarBtns", { display: "flex", flexWrap: "wrap", gap: "6px" });
	ensureCSS("html.mobile .composePopupMobile .composeToolbarBtns button", { padding: "6px 12px", fontSize: "13px", minHeight: "36px", height: "auto" });
	ensureCSS("html.mobile .composePopupMobile .composeAddrRow", { padding: "10px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .composePopupMobile .composeAddrRow td", { padding: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeSubjectRow", { padding: "10px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor });
	ensureCSS("html.mobile .composePopupMobile .composeSubjectRow td", { padding: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeCell > span", { display: "flex", alignItems: "stretch", gap: "8px", width: "100%", marginBottom: "6px" });
	ensureCSS("html.mobile .composePopupMobile .composeCell > span:last-child", { marginBottom: 0 });
	ensureCSS("html.mobile .composePopupMobile .composeCell .autosize", { flex: "1 1 0", minWidth: 0, display: "grid", width: "100%", maxWidth: "100%" });
	ensureCSS("html.mobile .composePopupMobile td .autosize", { display: "grid", width: "100%", maxWidth: "100%", boxSizing: "border-box" });
	ensureCSS("html.mobile .composePopupMobile .composeCell input, html.mobile .composePopupMobile .composeSubjectRow input", { width: "100%", boxSizing: "border-box", height: "44px", minHeight: "44px", padding: "0 10px" });
	ensureCSS("html.mobile .composePopupMobile .autosize.input", { width: "100%" });
	ensureCSS("html.mobile .composePopupMobile .composeCell .btnIcon", { width: "44px", minWidth: "44px", height: "44px", minHeight: "44px", flexShrink: 0, alignSelf: "auto", boxSizing: "border-box" });
	ensureCSS("html.mobile .composePopupMobile textarea.mono", { fontFamily: "inherit", minHeight: "12em", flex: "1 1 auto", width: "100%", boxSizing: "border-box", border: "none", borderTop: "1px solid", borderBottom: "1px solid", borderColor: styles.borderColor, borderRadius: 0, padding: "12px 16px", lineHeight: 1.5 });
	ensureCSS("html.mobile .composePopupMobile .composeMeta", { padding: "12px 16px", borderBottom: "1px solid", borderBottomColor: styles.borderColor, display: "flex", flexDirection: "column", gap: "12px", backgroundColor: styles.backgroundColor });
	ensureCSS("html.mobile .composePopupMobile .composeMeta label", { display: "flex", flexDirection: "column", alignItems: "stretch", gap: "6px", margin: 0, fontSize: "12px", fontWeight: 600, color: styles.colorMild });
	ensureCSS("html.mobile .composePopupMobile .composeMeta label select, html.mobile .composePopupMobile .composeMeta input[type=file], html.mobile .composePopupMobile .composeMeta input[type=datetime-local]", { width: "100%", maxWidth: "100%", minHeight: "44px", boxSizing: "border-box" });
	ensureCSS("html.mobile .composePopupMobile .composeSchedulePresets", { display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px" });
	ensureCSS("html.mobile .composePopupMobile .composeFooter", { display: "flex", flexDirection: "column", gap: "8px", flexShrink: 0, padding: "12px 16px calc(12px + env(safe-area-inset-bottom, 0))", borderTop: "1px solid", borderTopColor: styles.borderColor, backgroundColor: styles.backgroundColorMild, marginTop: "0" });
	ensureCSS("html.mobile .composePopupMobile .composeFooter button", { width: "100%", minHeight: "44px" });
	ensureCSS("html.mobile .composePopupMobile .composeFooter button[type=submit]", { fontWeight: 600 });
	ensureCSS(".searchHeaderRow", { display: "flex", alignItems: "stretch", gap: "8px", width: "100%" });
	ensureCSS(".searchHeaderRow input", { flex: "1 1 0", minWidth: 0, boxSizing: "border-box", minHeight: "38px", height: "38px" });
	ensureCSS(".searchHeaderActions", { display: "flex", gap: "6px", flexShrink: 0, alignItems: "stretch" });
	ensureCSS(".searchHeaderRow .btnIcon", { width: "38px", minWidth: "38px", height: "38px", minHeight: "38px", boxSizing: "border-box" });
	ensureCSS("html.mobile .webmailRoot", { paddingBottom: "env(safe-area-inset-bottom, 0)" });
	ensureCSS("html.mobile .yscroll, html.mobile .yscrollAuto", { touchAction: "pan-y" });
	var yscrollStyle = css("yscroll", { overflowY: "scroll", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 });
	var yscrollAutoStyle = css("yscrollAuto", { overflowY: "auto", position: "absolute", top: 0, bottom: 0, left: 0, right: 0 });
	css("autosize", { display: "inline-grid", maxWidth: "90vw" });
	ensureCSS(".autosize.input", { gridArea: "1 / 2" });
	ensureCSS(".autosize::after", { content: "attr(data-value)", marginRight: "1em", lineHeight: 0, visibility: "hidden", whiteSpace: "pre-wrap", overflowWrap: "anywhere", overflowX: "hidden" });
	var moxversion;
	var moxgoos;
	var moxgoarch;
	var log = /* @__PURE__ */ __name(() => {
	}, "log");
	try {
		if (localStorage.getItem("log") || location.hostname === "localhost") {
			log = console.log;
		}
	} catch (err) {
	}
	var accountSettings;
	var introboxMailbox = "";
	var defaultSettings = {
		mailboxesWidth: 240,
		layout: "leftright",
		// leftright, topbottom, or auto. Auto still follows the window width.
		leftWidthPct: 50,
		// Split in percentage of remaining width for left/right layout.
		topHeightPct: 40,
		// Split in percentage of remaining height for top/bottom layout.
		msglistflagsWidth: 40,
		// Width in pixels of flags column in message list.
		msglistageWidth: 70,
		// Width in pixels of age column.
		msglistfromPct: 30,
		// Percentage of remaining width in message list to use for "from" column. The remainder is for the subject.
		refine: "",
		// Refine filters, e.g. '', 'attachments', 'read', 'unread', 'flagged', 'label:...'.
		orderAsc: false,
		// Order from most recent to least recent by default.
		ignoreErrorsUntil: 0,
		// For unhandled javascript errors/rejected promises, we normally show a popup for details, but users can ignore them for a week at a time.
		mailboxCollapsed: {},
		// Mailboxes that are collapsed.
		showAllHeaders: false,
		// Whether to show all message headers.
		threading: ThreadMode.ThreadOn,
		checkConsistency: location.hostname === "localhost",
		// Enable UI update consistency checks, default only for local development.
		composeWidth: 0,
		composeViewportWidth: 0,
		composeHeight: 0,
		composeViewportHeight: 0
	};
	var parseSettings = /* @__PURE__ */ __name(() => {
		try {
			const v = window.localStorage.getItem("settings");
			if (!v) {
				return { ...defaultSettings };
			}
			const x = JSON.parse(v);
			const def = defaultSettings;
			const getString = /* @__PURE__ */ __name((k, ...l) => {
				const v2 = x[k];
				if (typeof v2 !== "string" || l.length > 0 && !l.includes(v2)) {
					return def[k];
				}
				return v2;
			}, "getString");
			const getBool = /* @__PURE__ */ __name((k) => {
				const v2 = x[k];
				return typeof v2 === "boolean" ? v2 : def[k];
			}, "getBool");
			const getInt = /* @__PURE__ */ __name((k) => {
				const v2 = x[k];
				return typeof v2 === "number" ? v2 : def[k];
			}, "getInt");
			let mailboxCollapsed = x.mailboxCollapsed;
			if (!mailboxCollapsed || typeof mailboxCollapsed !== "object") {
				mailboxCollapsed = def.mailboxCollapsed;
			}
			return {
				refine: getString("refine"),
				orderAsc: getBool("orderAsc"),
				mailboxesWidth: getInt("mailboxesWidth"),
				leftWidthPct: getInt("leftWidthPct"),
				topHeightPct: getInt("topHeightPct"),
				msglistflagsWidth: getInt("msglistflagsWidth"),
				msglistageWidth: getInt("msglistageWidth"),
				msglistfromPct: getInt("msglistfromPct"),
				ignoreErrorsUntil: getInt("ignoreErrorsUntil"),
				layout: getString("layout", "auto", "leftright", "topbottom"),
				mailboxCollapsed,
				showAllHeaders: getBool("showAllHeaders"),
				threading: getString("threading", ThreadMode.ThreadOff, ThreadMode.ThreadOn, ThreadMode.ThreadUnread),
				checkConsistency: getBool("checkConsistency"),
				composeWidth: getInt("composeWidth"),
				composeViewportWidth: getInt("composeViewportWidth"),
				composeHeight: getInt("composeHeight"),
				composeViewportHeight: getInt("composeViewportHeight")
			};
		} catch (err) {
			console.log("getting settings from localstorage", err);
			return { ...defaultSettings };
		}
	}, "parseSettings");
	var settingsPut = /* @__PURE__ */ __name((nsettings) => {
		settings = nsettings;
		try {
			window.localStorage.setItem("settings", JSON.stringify(nsettings));
		} catch (err) {
			console.log("storing settings in localstorage", err);
		}
	}, "settingsPut");
	var settings = parseSettings();
	var accountAddresses = [];
	var loginAddress = null;
	var domainAddressConfigs = {};
	var rejectsMailbox = "";
	var lastServerVersion = "";
	var scheduledTimers = /* @__PURE__ */ new Map();
	var login = /* @__PURE__ */ __name(async (reason) => {
		popupOpen = true;
		return new Promise((resolve, _) => {
			const origFocus = document.activeElement;
			let reasonElem;
			let fieldset;
			let autosize;
			let username;
			let password;
			const root = dom.div(css("loginOverlay", { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: styles.overlayOpaqueBackgroundColor, display: "flex", alignItems: "center", justifyContent: "center", zIndex: zindexes.login, animation: "fadein .15s ease-in" }), dom.div(style({ display: "flex", flexDirection: "column", alignItems: "center" }), reasonElem = reason ? dom.div(css("sessionError", { marginBottom: "2ex", textAlign: "center" }), reason) : dom.div(), dom.div(css("loginPopup", {
				backgroundColor: styles.popupBackgroundColor,
				boxShadow: styles.floatShadow,
				border: "1px solid",
				borderColor: styles.floatBorderColor,
				borderRadius: styles.radius,
				padding: "1.5em",
				maxWidth: "95vw",
				overflowX: "auto",
				maxHeight: "95vh",
				overflowY: "auto",
				marginBottom: "20vh"
			}), dom.form(/* @__PURE__ */ __name(async function submit(e) {
				e.preventDefault();
				e.stopPropagation();
				reasonElem.remove();
				try {
					fieldset.disabled = true;
					const loginToken = await client.LoginPrep();
					const token = await client.Login(loginToken, username.value, password.value);
					try {
						window.localStorage.setItem("webmailcsrftoken", token);
					} catch (err) {
						console.log("saving csrf token in localStorage", err);
					}
					root.remove();
					if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
						origFocus.focus();
					}
					popupOpen = false;
					resolve(token);
				} catch (err) {
					console.log(ui("login error"), err);
					window.alert(ui("Error: ") + errmsg(err));
				} finally {
					fieldset.disabled = false;
				}
			}, "submit"), fieldset = dom.fieldset(dom.h1(ui("Mail")), dom.label(style({ display: "block", marginBottom: "2ex" }), dom.div(ui("Email address"), style({ marginBottom: ".5ex" })), autosize = dom.span(dom._class("autosize"), username = dom.input(attr.required(""), attr.autocomplete("email"), attr.placeholder(ui("jane@example.org")), /* @__PURE__ */ __name(function change() {
				autosize.dataset.value = username.value;
			}, "change"), /* @__PURE__ */ __name(function input() {
				autosize.dataset.value = username.value;
			}, "input")))), dom.label(style({ display: "block", marginBottom: "2ex" }), dom.div(ui("Password"), style({ marginBottom: ".5ex" })), password = dom.input(attr.type("password"), attr.autocomplete("current-password"), attr.required(""))), dom.div(style({ textAlign: "center" }), dom.submitbutton(ui("Login"))))))));
			document.body.appendChild(root);
			username.focus();
		});
	}, "login");
	var localStorageGet = /* @__PURE__ */ __name((k) => {
		try {
			return window.localStorage.getItem(k);
		} catch (err) {
			return null;
		}
	}, "localStorageGet");
	var localStorageRemove = /* @__PURE__ */ __name((k) => {
		try {
			return window.localStorage.removeItem(k);
		} catch (err) {
		}
	}, "localStorageRemove");
	var client = new Client().withOptions({ csrfHeader: "x-mox-csrf", login }).withAuthToken(localStorageGet("webmailcsrftoken") || "");
	var link = /* @__PURE__ */ __name((href, anchorOpt) => dom.a(attr.href(href), attr.rel("noopener noreferrer"), attr.target("_blank"), anchorOpt || href), "link");
	var envelopeIdentity = /* @__PURE__ */ __name((l) => {
		for (const a of l) {
			const ma = accountAddresses.find((aa) => (!aa.User || aa.User === a.User) && aa.Domain.ASCII === a.Domain.ASCII);
			if (ma) {
				return { Name: ma.Name, User: a.User, Domain: a.Domain };
			}
		}
		return null;
	}, "envelopeIdentity");
	var shortcutElem = dom.div(css("shortcutFlash", { fontSize: "2em", position: "absolute", left: ".25em", bottom: ".25em", backgroundColor: styles.accent, padding: "0.25em .5em", color: "white", borderRadius: styles.radius, boxShadow: styles.shadowSm }));
	var shortcutTimer = 0;
	var showShortcut = /* @__PURE__ */ __name((c) => {
		if (accountSettings?.NoShowShortcuts) {
			return;
		}
		if (shortcutTimer) {
			window.clearTimeout(shortcutTimer);
		}
		shortcutElem.remove();
		dom._kids(shortcutElem, c);
		document.body.appendChild(shortcutElem);
		shortcutTimer = window.setTimeout(() => {
			shortcutElem.remove();
			shortcutTimer = 0;
		}, 1500);
	}, "showShortcut");
	var shortcutCmd = /* @__PURE__ */ __name(async (cmdfn, shortcuts) => {
		let shortcut = "";
		for (const k in shortcuts) {
			if (shortcuts[k] === cmdfn) {
				shortcut = k;
				break;
			}
		}
		if (shortcut) {
			showShortcut(shortcut);
		}
		await cmdfn();
	}, "shortcutCmd");
	var clickCmd = /* @__PURE__ */ __name((cmdfn, shortcuts) => {
		return /* @__PURE__ */ __name(async function click() {
			shortcutCmd(cmdfn, shortcuts);
		}, "click");
	}, "clickCmd");
	var enterCmd = /* @__PURE__ */ __name((cmdfn, shortcuts) => {
		return /* @__PURE__ */ __name(async function keydown(e) {
			if (e.key === "Enter") {
				e.stopPropagation();
				shortcutCmd(cmdfn, shortcuts);
			}
		}, "keydown");
	}, "enterCmd");
	var keyHandler = /* @__PURE__ */ __name((shortcuts) => {
		return async (k, e) => {
			const fn = shortcuts[k];
			if (fn) {
				e.preventDefault();
				e.stopPropagation();
				fn();
			}
		};
	}, "keyHandler");
	var formatSize = /* @__PURE__ */ __name((size) => size > 1024 * 1024 ? (size / (1024 * 1024)).toFixed(1) + "mb" : Math.ceil(size / 1024) + "kb", "formatSize");
	var parseSearchSize = /* @__PURE__ */ __name((s) => {
		s = s.trim();
		if (!s) {
			return ["", 0];
		}
		const digits = s.match(/^([0-9]+)/)?.[1];
		if (!digits) {
			return ["", 0];
		}
		let num = parseInt(digits);
		if (isNaN(num)) {
			return ["", 0];
		}
		const suffix = s.substring(digits.length).trim().toLowerCase();
		if (["b", "kb", "mb", "gb"].includes(suffix)) {
			return [digits + suffix, num * Math.pow(2, 10 * ["b", "kb", "mb", "gb"].indexOf(suffix))];
		}
		if (["k", "m", "g"].includes(suffix)) {
			return [digits + suffix + "b", num * Math.pow(2, 10 * (1 + ["k", "m", "g"].indexOf(suffix)))];
		}
		return ["", 0];
	}, "parseSearchSize");
	var fixDate = /* @__PURE__ */ __name((dt) => {
		const t = dt.split("-");
		if (t.length !== 3) {
			return dt;
		}
		if (t[1].length === 1) {
			t[1] = "0" + t[1];
		}
		if (t[2].length === 1) {
			t[2] = "0" + t[2];
		}
		return t.join("-");
	}, "fixDate");
	var parseSearchDateTime = /* @__PURE__ */ __name((s, isstart) => {
		const t = s.split("T", 2);
		if (t.length === 2) {
			const d = /* @__PURE__ */ new Date(fixDate(t[0]) + "T" + t[1]);
			return d ? d.toJSON() : void 0;
		} else if (t.length === 1) {
			const fds = fixDate(t[0]);
			if (!isNaN(Date.parse(fds))) {
				const d = new Date(fds);
				if (!isstart) {
					d.setDate(d.getDate() + 1);
				}
				return d.toJSON();
			} else {
				const tm = t[0];
				const now = /* @__PURE__ */ new Date();
				const pad0 = /* @__PURE__ */ __name((v) => v <= 9 ? "0" + v : "" + v, "pad0");
				const d = /* @__PURE__ */ new Date([now.getFullYear(), pad0(now.getMonth() + 1), pad0(now.getDate())].join("-") + "T" + tm);
				return d ? d.toJSON() : void 0;
			}
		}
		return void 0;
	}, "parseSearchDateTime");
	var dquote = /* @__PURE__ */ __name((s) => '"' + s.replaceAll('"', '""') + '"', "dquote");
	var needsDquote = /* @__PURE__ */ __name((s) => /[ \t"]/.test(s), "needsDquote");
	var packToken = /* @__PURE__ */ __name((t) => (t[0] ? "-" : "") + (t[1] ? t[1] + ":" : "") + (t[2] || needsDquote(t[3]) ? dquote(t[3]) : t[3]), "packToken");
	var parseSearchTokens = /* @__PURE__ */ __name((s) => {
		if (!s) {
			return [];
		}
		const l = [];
		let not = false;
		let quoted = false;
		let quoteend = false;
		let t = "";
		let tquoted = false;
		const add = /* @__PURE__ */ __name(() => {
			if (t && (tquoted || !t.includes(":"))) {
				l.push([not, "", tquoted, t]);
			} else if (t) {
				const tag = t.split(":", 1)[0];
				l.push([not, tag, tquoted, t.substring(tag.length + 1)]);
			}
			t = "";
			quoted = false;
			quoteend = false;
			tquoted = false;
			not = false;
		}, "add");
		[...s].forEach((c) => {
			if (quoteend) {
				if (c === '"') {
					t += '"';
					quoteend = false;
				} else if (t) {
					add();
				}
			} else if (quoted && c === '"') {
				quoteend = true;
			} else if (c === '"') {
				quoted = true;
				if (!t) {
					tquoted = true;
				}
			} else if (!quoted && (c === " " || c === "	")) {
				add();
			} else if (c === "-" && !t && !tquoted && !not) {
				not = true;
			} else {
				t += c;
			}
		});
		add();
		return l;
	}, "parseSearchTokens");
	var newFilter = /* @__PURE__ */ __name(() => {
		return {
			MailboxID: 0,
			MailboxChildrenIncluded: false,
			MailboxName: "",
			Attachments: AttachmentType.AttachmentIndifferent,
			SizeMin: 0,
			SizeMax: 0
		};
	}, "newFilter");
	var newNotFilter = /* @__PURE__ */ __name(() => {
		return {
			Attachments: AttachmentType.AttachmentIndifferent
		};
	}, "newNotFilter");
	var parseSearch = /* @__PURE__ */ __name((searchquery, mailboxlistView) => {
		const tokens = parseSearchTokens(searchquery);
		const fpos = newFilter();
		fpos.MailboxID = -1;
		const notf = newNotFilter();
		const strs = { Oldest: "", Newest: "", SizeMin: "", SizeMax: "" };
		tokens.forEach((t) => {
			const [not, tag, _, s] = t;
			const f = not ? notf : fpos;
			if (!not) {
				if (tag === "mb" || tag === "mailbox") {
					const mb = mailboxlistView.findMailboxByName(s);
					if (mb) {
						fpos.MailboxID = mb.ID;
					} else if (s === "") {
						fpos.MailboxID = 0;
					} else {
						fpos.MailboxName = s;
						fpos.MailboxID = 0;
					}
					return;
				} else if (tag === "submb") {
					fpos.MailboxChildrenIncluded = true;
					return;
				} else if (tag === "start") {
					const dt = parseSearchDateTime(s, true);
					if (dt) {
						fpos.Oldest = new Date(dt);
						strs.Oldest = s;
						return;
					}
				} else if (tag === "end") {
					const dt = parseSearchDateTime(s, false);
					if (dt) {
						fpos.Newest = new Date(dt);
						strs.Newest = s;
						return;
					}
				} else if (tag === "a" || tag === "attachments") {
					if (s === "none" || s === "any" || s === "image" || s === "pdf" || s === "archive" || s === "zip" || s === "spreadsheet" || s === "document" || s === "presentation") {
						fpos.Attachments = s;
						return;
					}
				} else if (tag === "h" || tag === "header") {
					const k = s.split(":")[0];
					const v = s.substring(k.length + 1);
					if (!fpos.Headers) {
						fpos.Headers = [[k, v]];
					} else {
						fpos.Headers.push([k, v]);
					}
					return;
				} else if (tag === "minsize") {
					const [str, size] = parseSearchSize(s);
					if (str) {
						fpos.SizeMin = size;
						strs.SizeMin = str;
						return;
					}
				} else if (tag === "maxsize") {
					const [str, size] = parseSearchSize(s);
					if (str) {
						fpos.SizeMax = size;
						strs.SizeMax = str;
						return;
					}
				}
			}
			if (tag === "f" || tag === "from") {
				f.From = f.From || [];
				f.From.push(s);
				return;
			} else if (tag === "t" || tag === "to") {
				f.To = f.To || [];
				f.To.push(s);
				return;
			} else if (tag === "s" || tag === "subject") {
				f.Subject = f.Subject || [];
				f.Subject.push(s);
				return;
			} else if (tag === "l" || tag === "label") {
				f.Labels = f.Labels || [];
				f.Labels.push(s);
				return;
			}
			f.Words = f.Words || [];
			f.Words.push((tag ? tag + ":" : "") + s);
		});
		return [fpos, notf, strs];
	}, "parseSearch");
	var errmsg = /* @__PURE__ */ __name((err) => "" + (err.message || "(no error message)"), "errmsg");
	var datalistgen = 1;
	var newAddressComplete = /* @__PURE__ */ __name(() => {
		let datalist;
		let completeMatches;
		let completeSearch;
		let completeFull;
		let aborter = {};
		return /* @__PURE__ */ __name(async function keydown(e) {
			const target = e.target;
			if (!datalist) {
				datalist = dom.datalist(attr.id("list-" + datalistgen++));
				target.parentNode.insertBefore(datalist, target);
				target.setAttribute("list", datalist.id);
			}
			const search = target.value;
			if (e.key === "Tab") {
				const matches = (completeMatches || []).filter((s) => s.includes(search));
				if (matches.length > 0) {
					target.value = matches[0];
					return;
				} else if ((completeMatches || []).length === 0 && !search) {
					return;
				}
			}
			if (completeSearch && search.includes(completeSearch) && completeFull) {
				dom._kids(datalist, (completeMatches || []).filter((s) => s.includes(search)).map((s) => dom.option(s)));
				return;
			} else if (search === completeSearch) {
				return;
			}
			if (aborter.abort) {
				aborter.abort();
			}
			aborter = {};
			try {
				[completeMatches, completeFull] = await withStatus("Autocompleting addresses", client.withOptions({ aborter }).CompleteRecipient(search));
				completeSearch = search;
				dom._kids(datalist, (completeMatches || []).map((s) => dom.option(s)));
			} catch (err) {
				log("autocomplete error", errmsg(err));
			} finally {
				aborter = {};
			}
		}, "keydown");
	}, "newAddressComplete");
	var flagList = /* @__PURE__ */ __name((miv) => {
		const msgflags = [];
		const othermsgflags = [];
		let l = msgflags;
		const seen = /* @__PURE__ */ new Set();
		const flag2 = /* @__PURE__ */ __name((v, char, name) => {
			if (v && !seen.has(name)) {
				l.push([name, char]);
				seen.add(name);
			}
		}, "flag");
		const addFlags = /* @__PURE__ */ __name((mi, ownRow) => {
			const m = mi.Message;
			flag2(!m.Junk && !m.Notjunk, "?", ui("Unclassified, neither junk nor not junk: message does not contribute to spam classification of new incoming messages"));
			flag2(m.Answered, "r", ui("Replied/answered"));
			if (!ownRow) {
				flag2(m.Flagged, "!", ui("Flagged"));
			}
			flag2(m.Forwarded, "f", ui("Forwarded"));
			flag2(m.Junk, "j", ui("Junk"));
			flag2(m.Deleted, "D", ui("Deleted, used in IMAP, message will likely be removed soon."));
			flag2(m.Draft, "d", ui("Draft"));
			flag2(m.Phishing, "p", ui("Phishing"));
			flag2(mi.Attachments && mi.Attachments.length > 0 ? true : false, "a", ui("Has at least one attachment"));
			if (m.ThreadMuted) {
				flag2(true, "m", ui("Muted, new messages are automatically marked as read."));
			}
		}, "addFlags");
		addFlags(miv.messageitem, true);
		if (miv.isCollapsedThreadRoot()) {
			l = othermsgflags;
			for (miv of miv.descendants()) {
				addFlags(miv.messageitem, false);
			}
		}
		const flagCharIcons = {
			"r": reply,
			"!": flag,
			"f": forward,
			"j": junk,
			"a": attachment,
			"D": trash
		};
		const flagChar = /* @__PURE__ */ __name((c) => {
			const fn = flagCharIcons[c];
			if (fn) {
				return fn();
			}
			return c;
		}, "flagChar");
		const msgItemFlagStyle = css("msgItemFlag", { marginRight: "1px", fontWeight: "normal", fontSize: ".9em" });
		return msgflags.map((t) => dom.span(msgItemFlagStyle, flagChar(t[1]), attr.title(t[0]))).concat(othermsgflags.map((t) => dom.span(msgItemFlagStyle, css("msgItemFlagCollapsed", { color: styles.colorMilder }), flagChar(t[1]), attr.title(t[0]))));
	}, "flagList");
	var refineFilters = /* @__PURE__ */ __name((f, notf) => {
		const refine = settings.refine;
		if (refine) {
			f = { ...f };
			notf = { ...notf };
			if (refine === "unread") {
				notf.Labels = [...notf.Labels || []];
				notf.Labels = (notf.Labels || []).concat(["\\Seen"]);
			} else if (refine === "read") {
				f.Labels = [...f.Labels || []];
				f.Labels = (f.Labels || []).concat(["\\Seen"]);
			} else if (refine === "attachments") {
				f.Attachments = "any";
			} else if (refine === "flagged") {
				f.Labels = [...f.Labels || []];
				f.Labels = (f.Labels || []).concat(["\\Flagged"]);
			} else if (refine.startsWith("label:")) {
				f.Labels = [...f.Labels || []];
				f.Labels = (f.Labels || []).concat([refine.substring("label:".length)]);
			}
		}
		return [f, notf];
	}, "refineFilters");
	var startDrag = /* @__PURE__ */ __name((e, move) => {
		if (e.buttons !== 1) {
			return Promise.resolve();
		}
		return new Promise((resolve, _) => {
			e.preventDefault();
			e.stopPropagation();
			const stop = /* @__PURE__ */ __name(() => {
				document.body.removeEventListener("mousemove", move);
				document.body.removeEventListener("mouseup", stop);
				resolve();
			}, "stop");
			document.body.addEventListener("mousemove", move);
			document.body.addEventListener("mouseup", stop);
		});
	}, "startDrag");
	var focusPlaceholder = /* @__PURE__ */ __name((s) => {
		let orig = "";
		return [
			/* @__PURE__ */ __name(function focus(e) {
				const target = e.target;
				orig = target.getAttribute("placeholder") || "";
				target.setAttribute("placeholder", s);
			}, "focus"),
			/* @__PURE__ */ __name(function blur(e) {
				const target = e.target;
				if (orig) {
					target.setAttribute("placeholder", orig);
				} else {
					target.removeAttribute("placeholder");
				}
			}, "blur")
		];
	}, "focusPlaceholder");
	var parseLocationHash = /* @__PURE__ */ __name((mailboxlistView) => {
		let hash = decodeURIComponent((window.location.hash || "#").substring(1));
		let editMsgid = 0;
		const em = hash.match(/,compose:([0-9]+)$/);
		if (em) {
			editMsgid = parseInt(em[1]);
			hash = hash.substring(0, hash.length - em[0].length);
		}
		const m = hash.match(/,([0-9]+)$/);
		let msgid = 0;
		if (m) {
			msgid = parseInt(m[1]);
			hash = hash.substring(0, hash.length - m[0].length);
		}
		let initmailbox, initsearch;
		if (hash.startsWith("search ")) {
			initsearch = hash.substring("search ".length).trim();
		}
		let f, notf;
		if (initsearch) {
			[f, notf] = parseSearch(initsearch, mailboxlistView);
		} else {
			initmailbox = hash;
			if (!initmailbox) {
				initmailbox = "Inbox";
			}
			f = newFilter();
			const mb = mailboxlistView.findMailboxByName(initmailbox);
			if (mb) {
				f.MailboxID = mb.ID;
			} else {
				f.MailboxName = initmailbox;
			}
			notf = newNotFilter();
		}
		return [initsearch, msgid, editMsgid, f, notf];
	}, "parseLocationHash");
	var statusElem;
	var withStatus = /* @__PURE__ */ __name(async (action, promise, disablable, noAlert) => {
		let elem;
		let id = window.setTimeout(() => {
			elem = dom.span(action + "... ");
			statusElem.appendChild(elem);
			id = 0;
		}, 1e3);
		let origFocus = document.activeElement;
		try {
			if (disablable) {
				disablable.disabled = true;
			}
			return await promise;
		} catch (err) {
			if (id) {
				window.clearTimeout(id);
				id = 0;
			}
			if (err.code === "sherpa:aborted") {
				throw err;
			}
			if (!noAlert) {
				window.alert(ui("Error: ") + action + ": " + errmsg(err));
			}
			throw err;
		} finally {
			if (disablable) {
				disablable.disabled = false;
			}
			if (disablable && origFocus && document.activeElement !== origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
				origFocus.focus();
			}
			if (id) {
				window.clearTimeout(id);
			}
			if (elem) {
				elem.remove();
			}
		}
	}, "withStatus");
	var moveUndo = null;
	var moveUndoBar = null;
	var moveUndoHost = null;
	var clearMoveUndo = /* @__PURE__ */ __name(() => {
		moveUndo = null;
		if (moveUndoBar) {
			moveUndoBar.remove();
			moveUndoBar = null;
		}
	}, "clearMoveUndo");
	var groupMoveSources = /* @__PURE__ */ __name((sources) => {
		const byBox = /* @__PURE__ */ new Map();
		for (const source of sources) {
			const ids = byBox.get(source.mailboxID);
			if (ids) {
				ids.push(source.id);
			} else {
				byBox.set(source.mailboxID, [source.id]);
			}
		}
		return [...byBox].map(([mailboxID, ids]) => ({ mailboxID, ids }));
	}, "groupMoveSources");
	var offerMoveUndo = /* @__PURE__ */ __name((sources) => {
		const groups = groupMoveSources(sources);
		if (groups.length === 0) {
			return;
		}
		clearMoveUndo();
		const pending = { groups };
		moveUndo = pending;
		moveUndoBar = dom.div(dom._class("moveUndoBar"), attr.role("status"), ui("Moved"), dom.clickbutton(ui("Undo"), /* @__PURE__ */ __name(async function click() {
			if (moveUndo !== pending) {
				return;
			}
			clearMoveUndo();
			for (let i = 0; i < groups.length; i++) {
				try {
					await withStatus(ui("Moving back"), client.MessageMove(groups[i].ids, groups[i].mailboxID, false));
				} catch (err) {
					log({ err });
					offerMoveUndo(groups.slice(i).flatMap((g) => g.ids.map((id) => ({ id, mailboxID: g.mailboxID }))));
					return;
				}
			}
		}, "click")));
		const onOpenMessage = document.documentElement.classList.contains("mobile") && document.documentElement.classList.contains("mobile-pane-message");
		const host = !onOpenMessage && moveUndoHost ? moveUndoHost : document.body;
		if (host === document.body) {
			moveUndoBar.classList.add("moveUndoBarFloating");
		}
		host.appendChild(moveUndoBar);
	}, "offerMoveUndo");
	var dismissMoveUndoUnless = /* @__PURE__ */ __name((id) => {
		if (!moveUndo || moveUndo.groups.some((g) => g.ids.includes(id))) {
			return;
		}
		clearMoveUndo();
	}, "dismissMoveUndoUnless");
	var forgetMovedMessages = /* @__PURE__ */ __name((ids) => {
		if (moveUndo && ids.some((id) => moveUndo.groups.some((g) => g.ids.includes(id)))) {
			clearMoveUndo();
		}
	}, "forgetMovedMessages");
	var withDisabled = /* @__PURE__ */ __name(async (elem, p) => {
		try {
			elem.disabled = true;
			return await p;
		} catch (err) {
			log({ err });
			window.alert(ui("Error: ") + errmsg(err));
			throw err;
		} finally {
			elem.disabled = false;
		}
	}, "withDisabled");
	var popover = /* @__PURE__ */ __name((target, opts, ...kids) => {
		clearMoveUndo();
		const origFocus = document.activeElement;
		const pos = target.getBoundingClientRect();
		const close = /* @__PURE__ */ __name(() => {
			if (!root.parentNode) {
				return;
			}
			root.remove();
			if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
				origFocus.focus();
			}
		}, "close");
		const posx = opts.fullscreen ? style({ left: 0, right: 0 }) : pos.x < window.innerWidth / 3 ? style({ left: "" + pos.x + "px" }) : style({ right: "" + (window.innerWidth - pos.x - pos.width) + "px" });
		const posy = opts.fullscreen ? style({ top: 0, bottom: 0 }) : pos.y + pos.height > window.innerHeight * 2 / 3 ? style({ bottom: "" + (window.innerHeight - (pos.y - 1)) + "px", maxHeight: "" + (pos.y - 1 - 10) + "px" }) : style({ top: "" + (pos.y + pos.height + 1) + "px", maxHeight: "" + (window.innerHeight - (pos.y + pos.height + 1) - 10) + "px" });
		let content;
		const root = dom.div(css("popoverOverlay", { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: zindexes.popover, backgroundColor: styles.overlayBackgroundColor }), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			close();
		}, "click"), /* @__PURE__ */ __name(function keydown(e) {
			if (e.key === "Escape") {
				e.stopPropagation();
				close();
			}
		}, "keydown"), content = dom.div(attr.tabindex("0"), css("popoverContent", {
			position: "absolute",
			overflowY: "auto"
		}), posx, posy, /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
		}, "click"), opts.transparent ? [] : [
			css("popoverContentOpaque", {
				backgroundColor: styles.popupBackgroundColor,
				padding: "1em",
				borderRadius: styles.radius,
				boxShadow: styles.floatShadow,
				border: "1px solid",
				borderColor: styles.floatBorderColor,
				color: styles.popupColor
			})
		], ...kids));
		document.body.appendChild(root);
		const first = root.querySelector("input, select, textarea, button");
		if (first && first instanceof HTMLElement) {
			first.focus();
		} else {
			content.focus();
		}
		return close;
	}, "popover");
	var menuPopover = /* @__PURE__ */ __name((target, items, fit = false, listClass) => {
		const flat = items.flat().filter((b) => b instanceof HTMLElement);
		return popover(target, { transparent: true }, dom.div(dom._class("menuList", ...fit ? ["menuListFit"] : [], ...listClass ? [listClass] : []), ...flat.map((item) => dom.div(dom._class("menuItem"), item))));
	}, "menuPopover");
	var popupOpen = false;
	var popup = /* @__PURE__ */ __name((...kids) => {
		clearMoveUndo();
		const origFocus = document.activeElement;
		const close = /* @__PURE__ */ __name(() => {
			if (!root.parentNode) {
				return;
			}
			popupOpen = false;
			root.remove();
			if (origFocus && origFocus instanceof HTMLElement && origFocus.parentNode) {
				origFocus.focus();
			}
		}, "close");
		let content;
		const root = dom.div(css("popupOverlay", { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: styles.overlayBackgroundColor, display: "flex", alignItems: "flex-start", justifyContent: "center", zIndex: zindexes.popup }), /* @__PURE__ */ __name(function keydown(e) {
			if (e.key === "Escape") {
				e.stopPropagation();
				close();
			}
		}, "keydown"), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			close();
		}, "click"), content = dom.div(attr.tabindex("0"), dom._class("popupContent"), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
		}, "click"), kids));
		popupOpen = true;
		document.body.appendChild(root);
		content.focus();
		return close;
	}, "popup");
	var cmdSettings = /* @__PURE__ */ __name(async () => {
		let fieldset;
		let signature;
		let quoting;
		let showAddressSecurity;
		let showHTML;
		let showShortcuts;
		let showHeaders;
		if (!accountSettings) {
			throw new Error("No account settings fetched yet.");
		}
		const remove = popup(dom.form(dom._class("dialogForm"), dom._class("dialogPanel"), /* @__PURE__ */ __name(async function submit(e) {
			e.preventDefault();
			e.stopPropagation();
			const accSet = {
				ID: accountSettings.ID,
				Signature: signature.value,
				Quoting: quoting.value,
				ShowAddressSecurity: showAddressSecurity.checked,
				ShowHTML: showHTML.checked,
				NoShowShortcuts: !showShortcuts.checked,
				ShowHeaders: showHeaders.value.split("\n").map((s) => s.trim()).filter((s) => !!s)
			};
			await withDisabled(fieldset, client.SettingsSave(accSet));
			accountSettings = accSet;
			remove();
		}, "submit"), dom.div(dom._class("dialogHeader"), dom.h1(ui("Settings")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close without saving.")), /* @__PURE__ */ __name(function click() {
			remove();
		}, "click"))), dom.div(dom._class("dialogBody"), fieldset = dom.fieldset(dom.div(dom._class("dialogField"), dom.label(dom._class("dialogFieldLabel"), ui("Signature")), signature = dom.textarea(new String(accountSettings.Signature), attr.rows("" + Math.max(3, 1 + accountSettings.Signature.split("\n").length)))), dom.div(dom._class("dialogField"), dom.label(dom._class("dialogFieldLabel"), ui("Reply above/below original"), attr.title(ui("Auto: If text is selected, only the replied text is quoted and editing starts below. Otherwise, the full message is quoted and editing starts at the top."))), quoting = dom.select(dom.option(attr.value(""), ui("Auto")), dom.option(attr.value("bottom"), ui("Bottom"), accountSettings.Quoting === Quoting.Bottom ? attr.selected("") : []), dom.option(attr.value("top"), ui("Top"), accountSettings.Quoting === Quoting.Top ? attr.selected("") : []))), dom.label(dom._class("dialogCheckField"), showAddressSecurity = dom.input(attr.type("checkbox"), accountSettings.ShowAddressSecurity ? attr.checked("") : []), dom.span(ui("Show address security indications"), attr.title(ui("Show bars underneath address input fields, indicating support for STARTTLS/DNSSEC/DANE/MTA-STS/RequireTLS.")))), dom.label(dom._class("dialogCheckField"), showHTML = dom.input(attr.type("checkbox"), accountSettings.ShowHTML ? attr.checked("") : []), dom.span(ui("Show email as HTML instead of text by default for first-time senders"), attr.title(ui("Whether to show HTML or text is remembered per sender. This sets the default for unknown correspondents.")))), dom.label(dom._class("dialogCheckField"), showShortcuts = dom.input(attr.type("checkbox"), accountSettings.NoShowShortcuts ? [] : attr.checked("")), dom.span(ui("Show shortcut keys in bottom left after interaction with mouse"))), dom.div(dom._class("dialogField"), dom.label(dom._class("dialogFieldLabel"), ui("Show additional headers")), showHeaders = dom.textarea(new String((accountSettings.ShowHeaders || []).join("\n")), attr.rows("" + Math.max(3, 1 + (accountSettings.ShowHeaders || []).length))), dom.p(dom._class("dialogFieldHint"), ui("One header name per line, for example Delivered-To, X-Mox-Reason, User-Agent, \u2026 Refresh mailbox view for changes to take effect."))), dom.div(dom._class("dialogSection"), dom.div(dom._class("dialogSectionTitle"), ui("Mailto links")), dom.p(dom._class("dialogSectionText"), ui('Register "mailto:" links with the browser or operating system to compose a message in webmail.')), dom.div(dom._class("dialogActions"), dom.clickbutton(ui("Register"), attr.title(ui("In most browsers, registering is only allowed on HTTPS URLs. Your browser may ask for confirmation. If nothing appears to happen, the registration may already have been present.")), /* @__PURE__ */ __name(function click() {
			if (!window.navigator.registerProtocolHandler) {
				window.alert(ui('Registering a protocol handler ("mailto:") is not supported by your browser.'));
				return;
			}
			try {
				window.navigator.registerProtocolHandler("mailto", "#compose %s");
				window.alert(ui('"mailto:"-links have been registered'));
			} catch (err) {
				window.alert(ui('Error registering "mailto:" protocol handler: ') + errmsg(err));
			}
		}, "click")), dom.clickbutton(ui("Unregister"), attr.title(ui("Not all browsers implement unregistering via JavaScript.")), /* @__PURE__ */ __name(function click() {
			if (!window.navigator.unregisterProtocolHandler) {
				window.alert(ui('Unregistering a protocol handler ("mailto:") via JavaScript is not supported by your browser. See your browser settings to unregister.'));
				return;
			}
			try {
				window.navigator.unregisterProtocolHandler("mailto", "#compose %s");
			} catch (err) {
				window.alert(ui('Error unregistering "mailto:" protocol handler: ') + errmsg(err));
				return;
			}
			window.alert(ui('"mailto:" protocol handler unregistered.'));
		}, "click")))))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Cancel"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			remove();
		}, "click")), dom.submitbutton(dom._class("btnPrimary"), ui("Save")))));
	}, "cmdSettings");
	var cmdHelp = /* @__PURE__ */ __name(async () => {
		const remove = popup(dom.div(dom._class("dialogPanel"), dom._class("helpPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("Help and keyboard shortcuts")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close help.")), /* @__PURE__ */ __name(function click() {
			remove();
		}, "click"))), dom.div(dom._class("dialogBody"), dom.div(dom._class("helpColumns"), dom.div(dom.table(dom.tr(dom.td(attr.colspan("2"), dom.h2(ui("Global"), style({ margin: "0" })))), [
			["c", "compose new message"],
			["/", "search"],
			["i", "open inbox"],
			["?", "help"],
			["ctrl ?", "tooltip for focused element"],
			["ctrl m", "focus message"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))), dom.tr(dom.td(attr.colspan("2"), dom.h2(ui("Mailbox"), style({ margin: "0" })))), [
			["\u2190", "collapse"],
			["\u2192", "expand"],
			["b", "show more actions"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))), dom.tr(dom.td(attr.colspan("2"), dom.h2(ui("Message list"), style({ margin: "1ex 0 0 0" })))), dom.tr(dom.td("\u2193", ", j"), dom.td(ui("down one message")), dom.td(attr.rowspan("6"), css("helpSideNote", { color: styles.colorMilder, borderLeft: "2px solid", borderLeftColor: styles.accent, paddingLeft: ".5em" }), dom.div(ui("hold ctrl to only move focus"), attr.title(ui("ctrl-l and ctrl-u are left for the browser the handle"))), dom.div(ui("hold shift to expand selection")))), dom.tr(dom.td("\u2191", ", k"), dom.td(ui("up one message"))), [
			["PageDown, l", "down one screen"],
			["PageUp, h", "up one screen"],
			["End, .", "to last message"],
			["Home, ,", "to first message"],
			["Space", "toggle selection of message"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))), [
			["", ""],
			["d, Delete", "move to trash folder"],
			["D", "delete permanently"],
			["q", "move to junk folder"],
			["Q", "mark not junk"],
			["a", "move to archive folder"],
			["M", "mark unread and clear (non)junk flags"],
			["m", "mark read"],
			["u", "to next unread message"],
			["p", "to root of thread or previous thread"],
			["n", "to root of next thread"],
			["S", "select thread messages"],
			["C", "toggle thread collapse"],
			["X", "toggle thread mute, automatically marking new messages as read"],
			["\u2190", "collapse thread"],
			["\u2192", "expand thread"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))))), dom.div(dom.table(dom.tr(dom.td(attr.colspan("2"), dom.h2(ui("Compose"), style({ margin: "0" })))), [
			["ctrl Enter", "send message"],
			["ctrl shift Enter", "send message and archive thread"],
			["ctrl w", "close message"],
			["ctrl O", "add To"],
			["ctrl C", "add Cc"],
			["ctrl B", "add Bcc"],
			["ctrl Y", "add Reply-To"],
			["ctrl Backspace", "remove current address if empty"],
			["ctrl +", "add address of same type"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))), dom.tr(dom.td(attr.colspan("2"), dom.h2(ui("Message"), style({ margin: "1ex 0 0 0" })))), [
			["r", "reply or list reply"],
			["R", "reply all"],
			["f", "forward message"],
			["e", "edit draft"],
			["v", "view attachments"],
			["t", "view text version"],
			["T", "view HTML version"],
			["o", "open message in new tab"],
			["O", "show raw message"],
			["ctrl p", "print message"],
			["I", "toggle internals"],
			["ctrl i", "toggle all headers"],
			["alt k, alt ArrowUp", "scroll up"],
			["alt j, alt ArrowDown", "scroll down"],
			["alt K", "scroll to top"],
			["alt J", "scroll to end"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1])))), dom.tr(dom.td(dom.h2(ui("Attachments"), style({ margin: "1ex 0 0 0" })))), [
			["left, h", "previous attachment"],
			["right, l", "next attachment"],
			["0", "first attachment"],
			["$", "next attachment"],
			["d", "download"]
		].map((t) => dom.tr(dom.td(t[0]), dom.td(ui(t[1]))))), dom.div(style({ marginTop: "2ex", marginBottom: "1ex" }), dom.span(ui("Underdotted text"), attr.title(ui("Underdotted text shows additional information on hover."))), ui(" show an explanation or additional information when hovered.")), dom.div(style({ marginBottom: "1ex" }), ui("Multiple messages can be selected by clicking messages while holding the control and/or shift keys. Dragging messages and dropping them on a mailbox moves the messages to that mailbox.")), dom.div(style({ marginBottom: "1ex" }), ui("A word that mixes scripts, such as Latin and Cyrillic, with no space between them has an "), dom.span(dom._class("scriptswitch"), ui("orange underline")), ui(". That can be a sign of an intent to mislead (e.g. phishing).")), dom.div(style({ marginTop: "2ex" }), ui("Mox is open source email server software, this is version "), moxversion, ", see ", dom.a(attr.href("licenses.txt"), ui("licenses")), ".", dom.br(), ui("Feedback, including bug reports, is appreciated! "), link("https://github.com/mjl-/mox/issues/new"))))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Close"), /* @__PURE__ */ __name(function click() {
			remove();
		}, "click")))));
	}, "cmdHelp");
	var cmdTooltip = /* @__PURE__ */ __name(async () => {
		let elems = [];
		if (document.activeElement && document.activeElement !== document.body) {
			if (document.activeElement.getAttribute("title")) {
				elems = [document.activeElement];
			}
			elems = [...elems, ...document.activeElement.querySelectorAll("[title]")];
		}
		if (elems.length === 0) {
			const seen = {};
			elems = [...document.body.querySelectorAll("[title]:not(.notooltip):not(.silenttitle)")].filter((e) => {
				const title = e.getAttribute("title") || "";
				if (seen[title]) {
					return false;
				}
				seen[title] = true;
				return !(e instanceof HTMLInputElement || e instanceof HTMLSelectElement || e instanceof HTMLButtonElement || e instanceof HTMLTextAreaElement || e instanceof HTMLAnchorElement || e.getAttribute("tabindex") || e.closest("[tabindex]"));
			});
		}
		if (elems.length === 0) {
			window.alert(ui("No active elements with tooltips found."));
			return;
		}
		popover(document.body, { transparent: true, fullscreen: true }, ...elems.map((e) => {
			const title = e.getAttribute("title") || "";
			const pos = e.getBoundingClientRect();
			const hidden = pos.width === 0 && pos.height === 0;
			if (hidden) {
				const bar = document.querySelector(".topBar")?.getBoundingClientRect();
				return dom.div(css("tooltipContent", { position: "absolute", backgroundColor: [styles.mailboxesTopBackgroundColor, styles.backgroundColorMild], color: [styles.navTextHover, styles.color], borderRadius: styles.radius, padding: ".35em .5em", maxWidth: "50em", boxShadow: styles.shadowSm }), style({ left: "50%", transform: "translateX(-50%)", top: (bar ? bar.bottom : 48) + 8 + "px" }), title);
			}
			return dom.div(css("tooltipContent", { position: "absolute", backgroundColor: [styles.mailboxesTopBackgroundColor, styles.backgroundColorMild], color: [styles.navTextHover, styles.color], borderRadius: styles.radius, padding: ".35em .5em", maxWidth: "50em", boxShadow: styles.shadowSm }), pos.x < window.innerWidth / 3 ? style({ left: "" + pos.x + "px" }) : style({ right: "" + (window.innerWidth - pos.x - pos.width) + "px" }), pos.y + pos.height > window.innerHeight * 2 / 3 ? style({ bottom: "" + (window.innerHeight - (pos.y - 2)) + "px", maxHeight: "" + (pos.y - 2) + "px" }) : style({ top: "" + (pos.y + pos.height + 2) + "px", maxHeight: "" + (window.innerHeight - (pos.y + pos.height + 2)) + "px" }), title);
		}));
	}, "cmdTooltip");
	var composeView = null;
	var compose = /* @__PURE__ */ __name((opts, listMailboxes, setLocationHash) => {
		log("compose", opts);
		if (composeView) {
			window.alert(ui("Can only compose one message at a time."));
			return;
		}
		let fieldset;
		let from;
		let customFrom = null;
		let subjectAutosize;
		let subject;
		let body;
		let attachments;
		let requiretls;
		let toBtn, ccBtn, bccBtn, replyToBtn, customFromBtn;
		let replyToCell, toCell, ccCell, bccCell;
		let toRow, replyToRow, ccRow, bccRow;
		let toViews = [], replytoViews = [], ccViews = [], bccViews = [];
		let forwardAttachmentViews = [];
		let draftMessageID = opts.draftMessageID || 0;
		let draftSaveTimer = 0;
		let draftSavePromise = Promise.resolve(0);
		let draftLastText = opts.body;
		const draftCancelSaveTimer = /* @__PURE__ */ __name(() => {
			if (draftSaveTimer) {
				window.clearTimeout(draftSaveTimer);
				draftSaveTimer = 0;
			}
		}, "draftCancelSaveTimer");
		const draftScheduleSave = /* @__PURE__ */ __name(() => {
			if (draftSaveTimer || body.value === draftLastText) {
				return;
			}
			draftSaveTimer = window.setTimeout(async () => {
				draftSaveTimer = 0;
				await withStatus(ui("Saving draft"), draftSave());
				draftScheduleSave();
			}, 60 * 1e3);
		}, "draftScheduleSave");
		const draftSave = /* @__PURE__ */ __name(async () => {
			draftCancelSaveTimer();
			let replyTo = "";
			if (replytoViews && replytoViews.length === 1 && replytoViews[0].input.value) {
				replyTo = replytoViews[0].input.value;
			}
			const cm = {
				From: customFrom ? customFrom.value : from.value,
				To: toViews.map((v) => v.input.value).filter((s) => s),
				Cc: ccViews.map((v) => v.input.value).filter((s) => s),
				Bcc: bccViews.map((v) => v.input.value).filter((s) => s),
				ReplyTo: replyTo,
				Subject: subject.value,
				TextBody: body.value,
				ResponseMessageID: opts.responseMessageID || 0,
				DraftMessageID: draftMessageID
			};
			const mbdrafts = listMailboxes().find((mb) => mb.Draft);
			if (!mbdrafts) {
				throw new Error(ui("no designated drafts mailbox"));
			}
			draftSavePromise = client.MessageCompose(cm, mbdrafts.ID);
			try {
				draftMessageID = await draftSavePromise;
				cv.MsgID = draftMessageID;
				setLocationHash();
			} finally {
				draftSavePromise = Promise.resolve(0);
			}
			draftLastText = cm.TextBody;
		}, "draftSave");
		const unsavedChanges = /* @__PURE__ */ __name(() => opts.body !== body.value && (!draftMessageID || draftLastText !== body.value), "unsavedChanges");
		const cmdClose = /* @__PURE__ */ __name(async () => {
			draftCancelSaveTimer();
			await draftSavePromise;
			if (unsavedChanges()) {
				const action = await new Promise((resolve) => {
					const close = /* @__PURE__ */ __name((choice) => {
						resolve(choice);
						remove();
					}, "close");
					const remove = popup(dom.div(dom._class("dialogPanel"), dom._class("confirmPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("Unsaved changes")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Keep editing.")), /* @__PURE__ */ __name(function click() {
						close("cancel");
					}, "click"))), dom.div(dom._class("dialogBody"), dom.p(ui("The message has unsaved changes. What would you like to do?"))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Cancel"), /* @__PURE__ */ __name(function click() {
						close("cancel");
					}, "click")), dom.clickbutton(ui("Discard changes"), /* @__PURE__ */ __name(function click() {
						close("discard");
					}, "click")), draftMessageID ? dom.clickbutton(ui("Remove draft"), /* @__PURE__ */ __name(function click() {
						close("remove");
					}, "click")) : [], dom.clickbutton(dom._class("btnPrimary"), ui("Save draft"), /* @__PURE__ */ __name(function click() {
						close("save");
					}, "click")))));
				});
				if (action === "save") {
					await withStatus(ui("Saving draft"), draftSave());
				} else if (action === "remove") {
					if (draftMessageID) {
						forgetMovedMessages([draftMessageID]);
						await withStatus(ui("Removing draft"), client.MessageDelete([draftMessageID]));
					}
				} else if (action === "cancel") {
					return;
				}
			}
			composeElem.remove();
			composeView = null;
			setLocationHash();
		}, "cmdClose");
		const cmdSave = /* @__PURE__ */ __name(async () => {
			draftCancelSaveTimer();
			await draftSavePromise;
			await withStatus(ui("Saving draft"), draftSave());
		}, "cmdSave");
		const submit = /* @__PURE__ */ __name(async (archive) => {
			draftCancelSaveTimer();
			await draftSavePromise;
			const files = await new Promise((resolve, reject) => {
				const l = [];
				if (attachments.files && attachments.files.length === 0) {
					resolve(l);
					return;
				}
				[...attachments.files].forEach((f) => {
					const fr = new window.FileReader();
					fr.addEventListener("load", () => {
						l.push({ Filename: f.name, DataURI: fr.result });
						if (attachments.files && l.length === attachments.files.length) {
							resolve(l);
						}
					});
					fr.addEventListener("error", () => {
						reject(fr.error);
					});
					fr.readAsDataURL(f);
				});
			});
			let replyTo = "";
			if (replytoViews && replytoViews.length === 1 && replytoViews[0].input.value) {
				replyTo = replytoViews[0].input.value;
			}
			const forwardAttachmentPaths = forwardAttachmentViews.filter((v) => v.checkbox.checked).map((v) => v.path);
			const message = {
				From: customFrom ? customFrom.value : from.value,
				To: toViews.map((v) => v.input.value).filter((s) => s),
				Cc: ccViews.map((v) => v.input.value).filter((s) => s),
				Bcc: bccViews.map((v) => v.input.value).filter((s) => s),
				ReplyTo: replyTo,
				UserAgent: "moxwebmail/" + moxversion,
				Subject: subject.value,
				TextBody: body.value,
				Attachments: files,
				ForwardAttachments: forwardAttachmentPaths.length === 0 ? { MessageID: 0, Paths: [] } : { MessageID: opts.attachmentsMessageItem.Message.ID, Paths: forwardAttachmentPaths },
				IsForward: opts.isForward || false,
				ResponseMessageID: opts.responseMessageID || 0,
				RequireTLS: requiretls.value === "" ? null : requiretls.value === "yes",
				FutureRelease: scheduleTime.value ? new Date(scheduleTime.value) : null,
				ArchiveThread: archive,
				ArchiveReferenceMailboxID: opts.archiveReferenceMailboxID || 0,
				DraftMessageID: draftMessageID
			};
			await client.MessageSubmit(message);
			composeElem.remove();
			composeView = null;
			setLocationHash();
		}, "submit");
		const cmdSend = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Sending email"), submit(false), fieldset);
		}, "cmdSend");
		const cmdSendArchive = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Sending email and archive"), submit(true), fieldset);
		}, "cmdSendArchive");
		const cmdAddTo = /* @__PURE__ */ __name(async () => {
			newAddrView("", true, true, toViews, toBtn, toCell, toRow);
		}, "cmdAddTo");
		const cmdAddCc = /* @__PURE__ */ __name(async () => {
			newAddrView("", true, false, ccViews, ccBtn, ccCell, ccRow);
		}, "cmdAddCc");
		const cmdAddBcc = /* @__PURE__ */ __name(async () => {
			newAddrView("", true, false, bccViews, bccBtn, bccCell, bccRow);
		}, "cmdAddBcc");
		const cmdReplyTo = /* @__PURE__ */ __name(async () => {
			newAddrView("", false, false, replytoViews, replyToBtn, replyToCell, replyToRow, true);
		}, "cmdReplyTo");
		const cmdCustomFrom = /* @__PURE__ */ __name(async () => {
			if (customFrom) {
				return;
			}
			customFrom = dom.input(attr.value(from.value), attr.required(""), focusPlaceholder(ui("Jane <jane@example.org>")));
			from.replaceWith(customFrom);
			customFromBtn.remove();
		}, "cmdCustomFrom");
		const shortcuts = {
			"ctrl Enter": cmdSend,
			"ctrl shift Enter": cmdSendArchive,
			"ctrl w": cmdClose,
			"ctrl O": cmdAddTo,
			"ctrl C": cmdAddCc,
			"ctrl B": cmdAddBcc,
			"ctrl Y": cmdReplyTo,
			"ctrl s": cmdSave,
			"ctrl S": cmdClose
			// ctrl Backspace and ctrl = (+) not included, they are handled by keydown handlers on in the inputs they remove/add.
		};
		const newAddrView = /* @__PURE__ */ __name((addr, isRecipient, isTo, views, btn, cell, row, single) => {
			if (single && views.length !== 0) {
				return;
			}
			let rcptSecPromise = null;
			let rcptSecAddr = "";
			let rcptSecAborter = {};
			let autosizeElem, inputElem, securityBar;
			const fetchRecipientSecurity = /* @__PURE__ */ __name(() => {
				if (!accountSettings?.ShowAddressSecurity) {
					return;
				}
				if (inputElem.value === rcptSecAddr) {
					return;
				}
				securityBar.style.borderImage = "";
				rcptSecAddr = inputElem.value;
				if (!inputElem.value) {
					return;
				}
				if (rcptSecAborter.abort) {
					rcptSecAborter.abort();
					rcptSecAborter.abort = void 0;
				}
				const color = /* @__PURE__ */ __name((v2) => {
					if (v2 === SecurityResult.SecurityResultYes) {
						return styles.underlineGreen;
					} else if (v2 === SecurityResult.SecurityResultNo) {
						return styles.underlineRed;
					} else if (v2 === SecurityResult.SecurityResultUnknown) {
						return "transparent";
					}
					return styles.underlineGrey;
				}, "color");
				const setBar = /* @__PURE__ */ __name((c0, c1, c2, c3, c4) => {
					const stops = [
						c0 + " 0%",
						c0 + " 19%",
						"transparent 19%",
						"transparent 20%",
						c1 + " 20%",
						c1 + " 39%",
						"transparent 39%",
						"transparent 40%",
						c2 + " 40%",
						c2 + " 59%",
						"transparent 59%",
						"transparent 60%",
						c3 + " 60%",
						c3 + " 79%",
						"transparent 79%",
						"transparent 80%",
						c4 + " 80%",
						c4 + " 100%"
					].join(", ");
					securityBar.style.borderImage = "linear-gradient(to right, " + stops + ") 1";
				}, "setBar");
				const aborter = {};
				rcptSecAborter = aborter;
				rcptSecPromise = client.withOptions({ aborter }).RecipientSecurity(inputElem.value);
				rcptSecPromise.then((rs) => {
					setBar(color(rs.STARTTLS), color(rs.MTASTS), color(rs.DNSSEC), color(rs.DANE), color(rs.RequireTLS));
					const implemented = [];
					const check = /* @__PURE__ */ __name((v2, s) => {
						if (v2) {
							implemented.push(s);
						}
					}, "check");
					check(rs.STARTTLS === SecurityResult.SecurityResultYes, "STARTTLS");
					check(rs.MTASTS === SecurityResult.SecurityResultYes, "MTASTS");
					check(rs.DNSSEC === SecurityResult.SecurityResultYes, "DNSSEC");
					check(rs.DANE === SecurityResult.SecurityResultYes, "DANE");
					check(rs.RequireTLS === SecurityResult.SecurityResultYes, "RequireTLS");
					const status = ui("Security mechanisms known to be implemented by the recipient domain: ") + (implemented.length === 0 ? ui("(none)") : implemented.join(", ")) + ".";
					inputElem.setAttribute("title", status + "\n\n" + recipientSecurityTitle);
					aborter.abort = void 0;
					v.recipientSecurity = rs;
					if (isRecipient) {
						let reqtls = opts.isList !== true;
						const walk = /* @__PURE__ */ __name((l) => {
							for (const v2 of l) {
								if (v2.recipientSecurity?.RequireTLS !== SecurityResult.SecurityResultYes || v2.recipientSecurity?.MTASTS !== SecurityResult.SecurityResultYes && v2.recipientSecurity?.DANE !== SecurityResult.SecurityResultYes) {
									reqtls = false;
									break;
								}
							}
						}, "walk");
						walk(toViews);
						walk(ccViews);
						walk(bccViews);
						if (requiretls.value === "" || requiretls.value === "yes") {
							requiretls.value = reqtls ? "yes" : "";
						}
					}
				}, () => {
					setBar("#888", "#888", "#888", "#888", "#888");
					inputElem.setAttribute("title", ui("Error fetching security mechanisms known to be implemented by the recipient domain...\n\n") + recipientSecurityTitle);
					aborter.abort = void 0;
					if (requiretls.value === "yes") {
						requiretls.value = "";
					}
				});
			}, "fetchRecipientSecurity");
			const recipientSecurityTitle = ui("Description of security mechanisms recipient domains may implement:\n1. STARTTLS: Opportunistic (unverified) TLS with STARTTLS, successfully negotiated during the most recent delivery attempt.\n2. MTA-STS: For PKIX/WebPKI-verified TLS.\n3. DNSSEC: MX DNS records are DNSSEC-signed.\n4. DANE: First delivery destination host implements DANE for verified TLS.\n5. RequireTLS: SMTP extension for verified TLS delivery into recipient mailbox, support detected during the most recent delivery attempt.\n\nChecks STARTTLS, DANE and RequireTLS cover the most recently used delivery path, not necessarily all possible delivery paths.\n\nThe bars below the input field indicate implementation status by the recipient domain:\n- Red, not implemented/unsupported\n- Green, implemented/supported\n- Gray, error while determining\n- Absent/white, unknown or skipped (e.g. no previous delivery attempt, or DANE check skipped due to DNSSEC-lookup error)");
			const root = dom.span(autosizeElem = dom.span(dom._class("autosize"), inputElem = dom.input(focusPlaceholder(ui("Jane <jane@example.org>")), style({ width: "100%" }), attr.value(addr), newAddressComplete(), accountSettings?.ShowAddressSecurity ? attr.title(recipientSecurityTitle) : [], /* @__PURE__ */ __name(function keydown(e) {
				if (e.key === "Backspace" && e.ctrlKey && inputElem.value === "" && !(isTo && views.length === 1)) {
					remove();
				} else if (e.key === "=" && e.ctrlKey) {
					newAddrView("", isRecipient, isTo, views, btn, cell, row, single);
				} else {
					return;
				}
				e.preventDefault();
				e.stopPropagation();
			}, "keydown"), /* @__PURE__ */ __name(function input() {
				autosizeElem.dataset.value = inputElem.value;
			}, "input"), /* @__PURE__ */ __name(function change() {
				autosizeElem.dataset.value = inputElem.value;
				fetchRecipientSecurity();
			}, "change"), /* @__PURE__ */ __name(function paste(e) {
				const data = e.clipboardData?.getData("text/plain");
				if (typeof data !== "string" || data === "") {
					return;
				}
				const split = data.split(",");
				if (split.length <= 1) {
					return;
				}
				autosizeElem.dataset.value = inputElem.value = split[0];
				let last;
				for (const rest of split.splice(1)) {
					last = newAddrView(rest.trim(), isRecipient, isTo, views, btn, cell, row, single);
				}
				last.input.focus();
				e.preventDefault();
				e.stopPropagation();
			}, "paste")), securityBar = dom.span(css("securitybar", {
				margin: "0 1px",
				borderBottom: "1.5px solid",
				borderBottomColor: "transparent"
			}))), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.minus), attr.arialabel(ui("Remove address.")), attr.title(ui("Remove address.")), /* @__PURE__ */ __name(function click() {
				remove();
				if (single && views.length === 0) {
					btn.style.display = "";
				}
			}, "click")));
			autosizeElem.dataset.value = inputElem.value;
			const remove = /* @__PURE__ */ __name(() => {
				const i = views.indexOf(v);
				views.splice(i, 1);
				root.remove();
				if (views.length === 0) {
					row.style.display = "none";
				}
				if (views.length === 0 && single) {
					btn.style.display = "";
				}
				let next = cell.querySelector("input");
				if (!next) {
					let tr = row.nextSibling;
					while (tr) {
						next = tr.querySelector("input");
						if (!next && tr.nextSibling) {
							tr = tr.nextSibling;
							continue;
						}
						break;
					}
				}
				if (next) {
					next.focus();
				}
			}, "remove");
			const v = { root, input: inputElem, isRecipient, recipientSecurity: null };
			fetchRecipientSecurity();
			views.push(v);
			cell.appendChild(v.root);
			row.style.display = "";
			if (single) {
				btn.style.display = "none";
			}
			inputElem.focus();
			return v;
		}, "newAddrView");
		let noAttachmentsWarning;
		const checkAttachments = /* @__PURE__ */ __name(() => {
			const missingAttachments = !attachments.files?.length && !forwardAttachmentViews.find((v) => v.checkbox.checked) && !!body.value.split("\n").find((s) => !s.startsWith(">") && s.match(/attach(ed|ment)/));
			noAttachmentsWarning.style.display = missingAttachments ? "" : "none";
		}, "checkAttachments");
		const normalizeUser = /* @__PURE__ */ __name((a) => {
			let user = a.User;
			const domconf = domainAddressConfigs[a.Domain.ASCII];
			for (const sep of domconf.LocalpartCatchallSeparators || []) {
				user = user.split(sep)[0];
			}
			const localpartCaseSensitive = domconf.LocalpartCaseSensitive;
			if (!localpartCaseSensitive) {
				user = user.toLowerCase();
			}
			return user;
		}, "normalizeUser");
		const addressSelf = /* @__PURE__ */ __name((addr) => {
			return accountAddresses.find((a) => a.Domain.ASCII === addr.Domain.ASCII && (a.User === "" || normalizeUser(a) === normalizeUser(addr)));
		}, "addressSelf");
		let haveFrom = false;
		const fromOptions = accountAddresses.filter((a) => a.User).map((a) => {
			const selected = opts.from && opts.from.length === 1 && equalAddress(a, opts.from[0]) || loginAddress && equalAddress(a, loginAddress) && (!opts.from || envelopeIdentity(opts.from));
			const o = dom.option(formatAddress(a), selected ? attr.selected("") : []);
			if (selected) {
				haveFrom = true;
			}
			return o;
		});
		if (!haveFrom && opts.from && opts.from.length === 1) {
			const a = addressSelf(opts.from[0]);
			if (a) {
				const fromAddr = { Name: a.Name, User: opts.from[0].User, Domain: a.Domain };
				const o = dom.option(formatAddress(fromAddr), attr.selected(""));
				fromOptions.unshift(o);
			}
		}
		let scheduleLink;
		let scheduleElem;
		let scheduleTime;
		let scheduleWeekday;
		const pad0 = /* @__PURE__ */ __name((v) => v >= 10 ? "" + v : "0" + v, "pad0");
		const localdate = /* @__PURE__ */ __name((d) => [d.getFullYear(), pad0(d.getMonth() + 1), pad0(d.getDate())].join("-"), "localdate");
		const localdatetime = /* @__PURE__ */ __name((d) => localdate(d) + "T" + pad0(d.getHours()) + ":" + pad0(d.getMinutes()) + ":00", "localdatetime");
		const scheduleTimeChanged = /* @__PURE__ */ __name(() => {
			log("datetime change", scheduleTime.value);
			const d = new Date(scheduleTime.value);
			dom._kids(scheduleWeekday, Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString(uiLocale(), { weekday: "long" }));
		}, "scheduleTimeChanged");
		let resizeLast = null;
		let resizeTimer = 0;
		const initWidth = window.innerWidth === settings.composeViewportWidth ? settings.composeWidth : 0;
		const initHeight = window.innerHeight === settings.composeViewportHeight ? settings.composeHeight : 0;
		const composeTextMildStyle = css("composeTextMild", { textAlign: "right", color: styles.colorMild });
		const composeCellStyle = css("composeCell", { lineHeight: "1.5" });
		const composeElem = dom.div(css("composePopup", {
			position: "fixed",
			bottom: "1ex",
			right: "1ex",
			zIndex: zindexes.compose,
			backgroundColor: styles.popupBackgroundColor,
			boxShadow: styles.floatShadow,
			border: "1px solid",
			borderColor: styles.floatBorderColor,
			width: "min(42em, calc(100vw - 2rem))",
			minWidth: "0",
			maxWidth: "calc(100vw - 2rem)",
			borderRadius: styles.radius,
			display: "flex",
			flexDirection: "column"
		}), isMobile() ? dom._class("composePopupMobile") : [], isMobile() ? [] : initWidth ? style({ width: initWidth + "px" }) : [], isMobile() ? [] : initHeight ? style({ height: initHeight + "px" }) : [], dom.div(css("composeResizeGrab", { position: "absolute", marginTop: "-1em", marginLeft: "-1em", width: "1em", height: "1em", cursor: "nw-resize" }), /* @__PURE__ */ __name(async function mousedown(e) {
			page.style.pointerEvents = "none";
			resizeLast = null;
			await startDrag(e, (e2) => {
				if (resizeLast) {
					const bounds = composeElem.getBoundingClientRect();
					const width = Math.round(bounds.width + resizeLast.x - e2.clientX);
					const height = Math.round(bounds.height + resizeLast.y - e2.clientY);
					composeElem.style.width = width + "px";
					composeElem.style.height = height + "px";
					body.removeAttribute("rows");
					if (resizeTimer) {
						window.clearTimeout(resizeTimer);
					}
					resizeTimer = window.setTimeout(() => {
						settingsPut({ ...settings, composeWidth: width, composeHeight: height, composeViewportWidth: window.innerWidth, composeViewportHeight: window.innerHeight });
					}, 1e3);
				}
				resizeLast = { x: e2.clientX, y: e2.clientY };
			});
			page.style.pointerEvents = "";
		}, "mousedown")), dom.form(css("composeForm", {
			flexGrow: "1",
			display: "flex",
			flexDirection: "column"
		}), fieldset = dom.fieldset(css("composeFields", {
			flexGrow: "1",
			display: "flex",
			flexDirection: "column"
		}), dom.table(style({ width: "100%" }), dom.tr(dom._class("composeHeaderRow"), dom.td(attr.colspan("2"), dom.div(dom._class("composeFromBar"), dom.label(dom._class("composeFromLabel"), ui("From"), from = dom.select(attr.required(""), fromOptions)), dom.div(dom._class("composeHeaderActions"), listMailboxes().find((mb) => mb.Draft) ? [
			dom.clickbutton(ui("Save"), attr.title(ui("Save draft message.")), clickCmd(cmdSave, shortcuts))
		] : [], dom.clickbutton(ui("Close"), attr.title(ui("Close window, saving draft message if body has changed or a draft was saved earlier.")), clickCmd(cmdClose, shortcuts)))))), dom.tr(dom._class("composeToolbarRow"), dom.td(attr.colspan("2"), dom.div(dom._class("composeToolbarBtns"), toBtn = dom.clickbutton(ui("To"), clickCmd(cmdAddTo, shortcuts)), ccBtn = dom.clickbutton(ui("Cc"), clickCmd(cmdAddCc, shortcuts)), bccBtn = dom.clickbutton(ui("Bcc"), clickCmd(cmdAddBcc, shortcuts)), replyToBtn = dom.clickbutton(ui("Reply-To"), clickCmd(cmdReplyTo, shortcuts)), customFromBtn = dom.clickbutton(ui("Custom From"), attr.title(ui("Set custom From address/name.")), clickCmd(cmdCustomFrom, shortcuts))))), toRow = dom.tr(dom._class("composeAddrRow"), dom.td(ui("To:"), composeTextMildStyle), toCell = dom.td(composeCellStyle)), replyToRow = dom.tr(dom._class("composeAddrRow"), dom.td(ui("Reply-To:"), composeTextMildStyle), replyToCell = dom.td(composeCellStyle)), ccRow = dom.tr(dom._class("composeAddrRow"), dom.td(ui("Cc:"), composeTextMildStyle), ccCell = dom.td(composeCellStyle)), bccRow = dom.tr(dom._class("composeAddrRow"), dom.td(ui("Bcc:"), composeTextMildStyle), bccCell = dom.td(composeCellStyle)), dom.tr(dom._class("composeSubjectRow"), dom.td(ui("Subject:"), composeTextMildStyle), dom.td(subjectAutosize = dom.span(
			dom._class("autosize"),
			style({ width: "100%" }),
			// Without 100% width, the span takes minimal width for input, we want the full table cell.
			subject = dom.input(style({ width: "100%" }), attr.value(opts.subject || ""), attr.required(""), focusPlaceholder(ui("subject...")), /* @__PURE__ */ __name(function input() {
				subjectAutosize.dataset.value = subject.value;
			}, "input"))
		)))), body = dom.textarea(
			dom._class("mono"),
			style({
				flexGrow: "1",
				width: "100%"
			}),
			initHeight === 0 ? attr.rows("15") : [],
			// Drives default size, removed on compose window resize.
			// Explicit string object so it doesn't get the highlight-unicode-block-changes
			// treatment, which would cause characters to disappear.
			new String(opts.body || ""),
			prop({ selectionStart: opts.editOffset || 0, selectionEnd: opts.editOffset || 0 }),
			/* @__PURE__ */ __name(function keyup(e) {
				if (e.key === "Enter") {
					checkAttachments();
				}
			}, "keyup"),
			!listMailboxes().find((mb) => mb.Draft) ? [] : /* @__PURE__ */ __name(function input() {
				draftScheduleSave();
			}, "input")
		), dom.div(dom._class("composeMeta"), !(opts.attachmentsMessageItem && opts.attachmentsMessageItem.Attachments && opts.attachmentsMessageItem.Attachments.length > 0) ? [] : dom.div(ui("Forward attachments: "), forwardAttachmentViews = (opts.attachmentsMessageItem?.Attachments || []).map((a) => {
			const filename = a.Filename || ui("(unnamed)");
			const size = formatSize(a.Part.DecodedSize);
			const checkbox = dom.input(attr.type("checkbox"), /* @__PURE__ */ __name(function change() {
				checkAttachments();
			}, "change"));
			const root = dom.label(checkbox, " " + filename + " ", dom.span("(" + size + ") ", styleClasses.textMild));
			const v = {
				path: a.Path || [],
				root,
				checkbox
			};
			return v;
		}), dom.label(styleClasses.textMild, dom.input(attr.type("checkbox"), /* @__PURE__ */ __name(function change(e) {
			forwardAttachmentViews.forEach((v) => v.checkbox.checked = e.target.checked);
		}, "change")), ui(" (Toggle all)"))), noAttachmentsWarning = dom.div(style({ display: "none" }), css("composeNoAttachmentsWarning", { backgroundColor: styles.warningBackgroundColor, padding: "0.35em .5em", borderRadius: styles.radius }), ui("Message mentions attachments, but no files are attached.")), dom.label(ui("Attachments "), attachments = dom.input(attr.type("file"), attr.multiple(""), /* @__PURE__ */ __name(function change() {
			checkAttachments();
		}, "change"))), dom.label(attr.title(ui("How to use TLS for message delivery over SMTP:\n\nDefault: Delivery attempts follow the policies published by the recipient domain: Verification with MTA-STS and/or DANE, or optional opportunistic unverified STARTTLS if the domain does not specify a policy.\n\nWith RequireTLS: For sensitive messages, you may want to require verified TLS. The recipient destination domain SMTP server must support the REQUIRETLS SMTP extension for delivery to succeed. It is automatically chosen when the destination domain mail servers of all recipients are known to support it.\n\nFallback to insecure: If delivery fails due to MTA-STS and/or DANE policies specified by the recipient domain, and the content is not sensitive, you may choose to ignore the recipient domain TLS policies so delivery can succeed.")), ui("TLS "), requiretls = dom.select(dom.option(attr.value(""), ui("Default")), dom.option(attr.value("yes"), ui("With RequireTLS")), dom.option(attr.value("no"), ui("Fallback to insecure")))), dom.div(scheduleLink = dom.a(attr.href(""), ui("Schedule"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			scheduleTime.value = localdatetime(/* @__PURE__ */ new Date());
			scheduleTimeChanged();
			scheduleLink.style.display = "none";
			scheduleElem.style.display = "";
			scheduleTime.setAttribute("required", "");
		}, "click")), scheduleElem = dom.div(style({ display: "none" }), dom.div(dom._class("composeSchedulePresets"), dom.clickbutton(ui("Start of next day"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			const d = new Date(scheduleTime.value);
			const nextday = new Date(d.getTime() + 24 * 3600 * 1e3);
			scheduleTime.value = localdate(nextday) + "T09:00:00";
			scheduleTimeChanged();
		}, "click")), dom.clickbutton(ui("+1 hour"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			const d = new Date(scheduleTime.value);
			scheduleTime.value = localdatetime(new Date(d.getTime() + 3600 * 1e3));
			scheduleTimeChanged();
		}, "click")), dom.clickbutton(ui("+1 day"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			const d = new Date(scheduleTime.value);
			scheduleTime.value = localdatetime(new Date(d.getTime() + 24 * 3600 * 1e3));
			scheduleTimeChanged();
		}, "click")), dom.clickbutton(ui("Now"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			scheduleTime.value = localdatetime(/* @__PURE__ */ new Date());
			scheduleTimeChanged();
		}, "click")), dom.clickbutton(ui("Cancel"), /* @__PURE__ */ __name(function click(e) {
			e.preventDefault();
			scheduleLink.style.display = "";
			scheduleElem.style.display = "none";
			scheduleTime.removeAttribute("required");
			scheduleTime.value = "";
		}, "click"))), dom.div(scheduleTime = dom.input(attr.type("datetime-local"), /* @__PURE__ */ __name(function change() {
			scheduleTimeChanged();
		}, "change")), ui(" in local timezone ") + (Intl.DateTimeFormat().resolvedOptions().timeZone || "") + ", ", scheduleWeekday = dom.span()))))), dom.div(dom._class("composeFooter"), opts.responseMessageID && listMailboxes().find((mb) => mb.Archive) ? dom.clickbutton(ui("Send and archive"), clickCmd(cmdSendArchive, shortcuts)) : [], dom.submitbutton(dom._class("btnPrimary"), ui("Send"))), /* @__PURE__ */ __name(async function submit2(e) {
			e.preventDefault();
			shortcutCmd(cmdSend, shortcuts);
		}, "submit")));
		subjectAutosize.dataset.value = subject.value;
		(opts.to && opts.to.length > 0 ? opts.to : [""]).forEach((s) => newAddrView(s, true, true, toViews, toBtn, toCell, toRow));
		(opts.cc || []).forEach((s) => newAddrView(s, true, false, ccViews, ccBtn, ccCell, ccRow));
		(opts.bcc || []).forEach((s) => newAddrView(s, true, false, bccViews, bccBtn, bccCell, bccRow));
		if (opts.replyto) {
			newAddrView(opts.replyto, false, false, replytoViews, replyToBtn, replyToCell, replyToRow, true);
		}
		if (!opts.cc || !opts.cc.length) {
			ccRow.style.display = "none";
		}
		if (!opts.bcc || !opts.bcc.length) {
			bccRow.style.display = "none";
		}
		if (!opts.replyto) {
			replyToRow.style.display = "none";
		}
		clearMoveUndo();
		document.body.appendChild(composeElem);
		if (toViews.length > 0 && !toViews[0].input.value) {
			toViews[0].input.focus();
		} else {
			body.focus();
		}
		const cv = {
			root: composeElem,
			MsgID: draftMessageID,
			key: keyHandler(shortcuts),
			unsavedChanges,
			save: cmdSave
		};
		composeView = cv;
		setLocationHash();
	}, "compose");
	var composeDraft = /* @__PURE__ */ __name(async (mi, pm, listMailboxes, setLocationHash) => {
		const m = mi.Message;
		const draftMailboxID = listMailboxes().find((mb) => mb.Draft)?.ID;
		if (m.MailboxID !== draftMailboxID) {
			throw new Error(ui("only messages in draft mailbox can be edited"));
		}
		const env = mi.Envelope;
		let refMsgID = 0;
		if (env.InReplyTo) {
			refMsgID = await withStatus(ui("Looking up referenced message"), client.MessageFindMessageID(env.InReplyTo));
		}
		const isForward = !!env.Subject.match(/^\[?fwd?:/i) || !!env.Subject.match(/\(fwd\)[ \t]*$/i);
		const opts = {
			from: env.From || [],
			to: (env.To || []).map((a) => formatAddress(a)),
			cc: (env.CC || []).map((a) => formatAddress(a)),
			bcc: (env.BCC || []).map((a) => formatAddress(a)),
			replyto: env.ReplyTo && env.ReplyTo.length > 0 ? formatAddress(env.ReplyTo[0]) : "",
			subject: env.Subject,
			isForward,
			body: pm.Texts && pm.Texts.length > 0 ? pm.Texts[0].replace(/\r/g, "") : "",
			responseMessageID: refMsgID,
			draftMessageID: m.ID
		};
		compose(opts, listMailboxes, setLocationHash);
	}, "composeDraft");
	var labelsPopover = /* @__PURE__ */ __name((e, msgs, possibleLabels) => {
		if (msgs.length === 0) {
			return;
		}
		const knownLabels = possibleLabels();
		const activeLabels = (msgs[0].Keywords || []).filter((kw) => msgs.filter((m) => (m.Keywords || []).includes(kw)).length === msgs.length);
		const msgIDs = msgs.map((m) => m.ID);
		let fieldsetnew;
		let newlabel;
		const remove = popover(e.target, { transparent: true }, dom.div(dom._class("menuList"), ...knownLabels.map((l) => dom.div(dom._class("menuItem"), dom.label(dom.input(attr.type("checkbox"), activeLabels.includes(l) ? attr.checked("") : [], attr.title(ui("Add/remove this label to the message(s), leaving other labels unchanged.")), /* @__PURE__ */ __name(async function change(e2) {
			const input = e2.target;
			if (input.checked) {
				await withStatus(ui("Adding label"), client.FlagsAdd(msgIDs, [l]), input);
				if (!activeLabels.includes(l)) {
					activeLabels.push(l);
				}
			} else {
				await withStatus(ui("Removing label"), client.FlagsClear(msgIDs, [l]), input);
				const i = activeLabels.indexOf(l);
				if (i >= 0) {
					activeLabels.splice(i, 1);
				}
			}
		}, "change")), dom.span(styleClasses.keyword, l)))), dom.div(dom._class("menuItem"), dom._class("menuItemForm"), dom.form(/* @__PURE__ */ __name(async function submit(e2) {
			e2.preventDefault();
			await withStatus(ui("Adding new label"), client.FlagsAdd(msgIDs, [newlabel.value]), fieldsetnew);
			remove();
		}, "submit"), fieldsetnew = dom.fieldset(dom.div(style({ display: "flex", gap: "6px", flexWrap: "wrap" }), newlabel = dom.input(focusPlaceholder(ui("new-label")), attr.required(""), style({ flex: "1 1 8em", minWidth: 0 }), attr.title(ui('New label to add/set on the message(s), must be lower-case, ascii-only, without spaces and without the following special characters: (){%*"\\].'))), dom.submitbutton(ui("Add new label"), attr.title(ui("Add this label to the message(s), leaving other labels unchanged.")))))))));
	}, "labelsPopover");
	var movePopover = /* @__PURE__ */ __name((e, mailboxes, msgs) => {
		if (msgs.length === 0) {
			return;
		}
		let msgsMailboxID = msgs[0].MailboxID && msgs.filter((m) => m.MailboxID === msgs[0].MailboxID).length === msgs.length ? msgs[0].MailboxID : 0;
		const remove = menuPopover(e.target, mailboxes.map((mb) => dom.clickbutton(mailboxLabel(mb, mb.Name), mb.ID === msgsMailboxID ? attr.disabled("") : [], /* @__PURE__ */ __name(async function click() {
			const moveMsgs = msgs.filter((m) => m.MailboxID !== mb.ID);
			const msgIDs = moveMsgs.map((m) => m.ID);
			await withStatus(ui("Moving to mailbox"), client.MessageMove(msgIDs, mb.ID, false));
			offerMoveUndo(moveMsgs.map((m) => ({ id: m.ID, mailboxID: m.MailboxID })));
			if (moveMsgs.length === 1) {
				await moveAskRuleset(moveMsgs[0].ID, moveMsgs[0].MailboxID, mb, mailboxes);
			}
			remove();
		}, "click"))));
	}, "movePopover");
	var moveAskRuleset = /* @__PURE__ */ __name(async (msgID, mbSrcID, mbDst, mailboxes) => {
		const mbSrc = mailboxes.find((mb) => mb.ID === mbSrcID);
		if (!mbSrc || isSpecialUse(mbDst) || isSpecialUse(mbSrc)) {
			return;
		}
		const [listID, msgFrom, isRemove, rcptTo, ruleset] = await withStatus(ui("Checking rulesets"), client.RulesetSuggestMove(msgID, mbSrc.ID, mbDst.ID));
		if (!ruleset) {
			return;
		}
		const what = listID ? ['list with id "', listID, '"'] : ['address "', msgFrom, '"'];
		if (isRemove) {
			const remove2 = popup(dom.div(dom._class("dialogPanel"), dom._class("confirmPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("Remove rule?")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close without removing rule.")), /* @__PURE__ */ __name(function click() {
				remove2();
			}, "click"))), dom.div(dom._class("dialogBody"), dom.p(ui("Would you like to remove the server-side rule that automatically delivers messages from "), what, ui(' to mailbox "'), mailboxLabel(mbDst, mbDst.Name), '"?'), dom.div(dom._class("dialogActionsStack"), dom.clickbutton(ui("No, and don't ask again for "), what, /* @__PURE__ */ __name(async function click() {
				await withStatus(ui("Store ruleset response"), client.RulesetMessageNever(rcptTo, listID, msgFrom, true));
				remove2();
			}, "click")), dom.clickbutton(ui(`No, and don't ask again when moving messages out of "`), mailboxLabel(mbSrc, mbSrc.Name), '"', /* @__PURE__ */ __name(async function click() {
				await withStatus(ui("Store ruleset response"), client.RulesetMailboxNever(mbSrc.ID, false));
				remove2();
			}, "click")))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Not now"), /* @__PURE__ */ __name(function click() {
				remove2();
			}, "click")), dom.clickbutton(dom._class("btnPrimary"), ui("Yes, remove rule"), /* @__PURE__ */ __name(async function click() {
				await withStatus(ui("Remove ruleset"), client.RulesetRemove(rcptTo, ruleset));
				remove2();
			}, "click")))));
			return;
		}
		const remove = popup(dom.div(dom._class("dialogPanel"), dom._class("confirmPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("Add rule?")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close without adding rule.")), /* @__PURE__ */ __name(function click() {
			remove();
		}, "click"))), dom.div(dom._class("dialogBody"), dom.p(ui("Would you like to create a server-side ruleset that automatically delivers future messages from "), what, ui(' to mailbox "'), mailboxLabel(mbDst, mbDst.Name), '"?'), dom.div(dom._class("dialogActionsStack"), dom.clickbutton(ui("No, and don't ask again for "), what, /* @__PURE__ */ __name(async function click() {
			await withStatus(ui("Store ruleset response"), client.RulesetMessageNever(rcptTo, listID, msgFrom, false));
			remove();
		}, "click")), dom.clickbutton(ui(`No, and don't ask again when moving messages to "`), mailboxLabel(mbDst, mbDst.Name), '"', /* @__PURE__ */ __name(async function click() {
			await withStatus(ui("Store ruleset response"), client.RulesetMailboxNever(mbDst.ID, true));
			remove();
		}, "click")))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Not now"), /* @__PURE__ */ __name(function click() {
			remove();
		}, "click")), dom.clickbutton(dom._class("btnPrimary"), ui("Yes, add rule"), /* @__PURE__ */ __name(async function click() {
			await withStatus(ui("Add ruleset"), client.RulesetAdd(rcptTo, ruleset));
			remove();
		}, "click")))));
	}, "moveAskRuleset");
	var isSpecialUse = /* @__PURE__ */ __name((mb) => mb.Archive || mb.Draft || mb.Junk || mb.Sent || mb.Trash, "isSpecialUse");
	var newMsgitemView = /* @__PURE__ */ __name((mi, msglistView, otherMailbox, listMailboxes, receivedTime, initialCollapsed) => {
		let ageTimer = 0;
		const identityTag = /* @__PURE__ */ __name((s, title) => dom.span(css("msgItemIdentity", { padding: "2px 8px", marginLeft: ".15em", borderRadius: "20px", fontWeight: "600", fontSize: "11px", whiteSpace: "nowrap", backgroundColor: styles.accentSoft, color: styles.accent, border: "1px solid", borderColor: styles.borderColor }), s, attr.title(title)), "identityTag");
		const identityHeader = [];
		if (!envelopeIdentity(mi.Envelope.From || []) && !envelopeIdentity(mi.Envelope.To || [])) {
			if (envelopeIdentity(mi.Envelope.CC || [])) {
				identityHeader.push(identityTag("cc", ui("You are in the CC header")));
			}
			if (envelopeIdentity(mi.Envelope.BCC || [])) {
				identityHeader.push(identityTag("bcc", ui("You are in the BCC header")));
			}
			if (identityHeader.length === 0) {
				identityHeader.push(identityTag("-", ui("You are not in any To, From, CC, BCC header. Could message to a mailing list or Bcc without Bcc message header.")));
			}
		}
		const remove = /* @__PURE__ */ __name(() => {
			msgitemView.root.remove();
			if (ageTimer) {
				window.clearTimeout(ageTimer);
				ageTimer = 0;
			}
		}, "remove");
		const age = /* @__PURE__ */ __name((date) => {
			const r = dom.span(dom._class("notooltip"), attr.title(date.toLocaleString(uiLocale())));
			const set = /* @__PURE__ */ __name(() => {
				const nowSecs = (/* @__PURE__ */ new Date()).getTime() / 1e3;
				let t = nowSecs - date.getTime() / 1e3;
				let negative = "";
				if (t < 0) {
					negative = "-";
					t = -t;
				}
				const minute = 60;
				const hour = 60 * minute;
				const day = 24 * hour;
				const month = 30 * day;
				const year = 365 * day;
				const periods = [year, month, day, hour, minute];
				const suffix = [ui("y"), ui("mo"), ui("d"), ui("h"), ui("min")];
				let s;
				let nextSecs = 0;
				for (let i = 0; i < periods.length; i++) {
					const p = periods[i];
					if (t >= 2 * p || i === periods.length - 1) {
						const n = Math.round(t / p);
						s = "" + n + suffix[i];
						const prev = Math.floor(t / p);
						nextSecs = Math.ceil((prev + 1) * p - t);
						break;
					}
				}
				if (t < 60) {
					s = ui("<1min");
					nextSecs = 60 - t;
					negative = "";
				}
				dom._kids(r, negative + s);
				if (nextSecs < 14 * 24 * 3600) {
					ageTimer = window.setTimeout(set, nextSecs * 1e3);
				} else {
					ageTimer = 0;
				}
			}, "set");
			set();
			return r;
		}, "age");
		const render = /* @__PURE__ */ __name(() => {
			const mi2 = msgitemView.messageitem;
			const m = mi2.Message;
			if (ageTimer) {
				window.clearTimeout(ageTimer);
				ageTimer = 0;
			}
			const keywords = (m.Keywords || []).map((kw) => dom.span(styleClasses.keyword, kw));
			if (msgitemView.isCollapsedThreadRoot()) {
				const keywordsSeen = /* @__PURE__ */ new Set();
				for (const kw of m.Keywords || []) {
					keywordsSeen.add(kw);
				}
				for (const miv of msgitemView.descendants()) {
					for (const kw of miv.messageitem.Message.Keywords || []) {
						if (!keywordsSeen.has(kw)) {
							keywordsSeen.add(kw);
							keywords.push(dom.span(styleClasses.keyword, dom._class("keywordCollapsed"), kw));
						}
					}
				}
			}
			let threadIndent = 0;
			for (let miv = msgitemView; miv.parent; miv = miv.parent) {
				threadIndent++;
			}
			let threadChar = "";
			let threadCharTitle = "";
			if (msgitemView.parent) {
				threadChar = "\u21B3";
				if (msgitemView.parent.messageitem.Message.MessageID === mi2.Message.MessageID) {
					threadChar = "\u2248";
					threadCharTitle = ui("Same Message-ID.");
				} else if (mi2.Message.ThreadMissingLink || (mi2.Message.ThreadParentIDs || []).length > 0 && (mi2.Message.ThreadParentIDs || [])[0] !== msgitemView.parent.messageitem.Message.ID) {
					threadChar = "\u21AF";
					threadCharTitle = ui("Immediate parent message is missing.");
				}
			}
			const isUnread = /* @__PURE__ */ __name(() => !mi2.Message.Seen || msgitemView.isCollapsedThreadRoot() && !!msgitemView.findDescendant((miv) => !miv.messageitem.Message.Seen), "isUnread");
			const isRelevant = /* @__PURE__ */ __name(() => !mi2.Message.ThreadMuted && mi2.MatchQuery || msgitemView.isCollapsedThreadRoot() && msgitemView.findDescendant((miv) => !miv.messageitem.Message.ThreadMuted && miv.messageitem.MatchQuery), "isRelevant");
			const received = /* @__PURE__ */ __name(() => {
				let r = mi2.Message.Received;
				if (!msgitemView.isCollapsedThreadRoot()) {
					return r;
				}
				msgitemView.descendants().forEach((dmiv) => {
					if (settings.orderAsc && dmiv.messageitem.Message.Received.getTime() < r.getTime()) {
						r = dmiv.messageitem.Message.Received;
					} else if (!settings.orderAsc && dmiv.messageitem.Message.Received.getTime() > r.getTime()) {
						r = dmiv.messageitem.Message.Received;
					}
				});
				return r;
			}, "received");
			const isThreadLast = /* @__PURE__ */ __name(() => {
				let miv = msgitemView.threadRoot();
				while (miv.kids.length > 0) {
					miv = miv.kids[miv.kids.length - 1];
				}
				return miv === msgitemView;
			}, "isThreadLast");
			const mailboxtags = [];
			const mailboxIDs = /* @__PURE__ */ new Set();
			const addMailboxTag = /* @__PURE__ */ __name((mb, isCollapsedKid) => {
				const full = mailboxLabel(mb, mb.Name);
				let name = full;
				mailboxIDs.add(mb.ID);
				if (name.length > 8 + 1 + 3 + 1 + 8 + 4) {
					const t = name.split("/");
					const first = t[0];
					const last = t[t.length - 1];
					if (first.length + last.length <= 8 + 8) {
						name = first + "/.../" + last;
					} else {
						name = first.substring(0, 8) + "/.../" + last.substring(0, 8);
					}
				}
				const e = dom.span(css("msgItemMailbox", { padding: "2px 8px", marginLeft: ".15em", borderRadius: "20px", fontWeight: "600", fontSize: "11px", whiteSpace: "nowrap", background: styles.accentSoft, color: styles.accent, border: "1px solid", borderColor: styles.borderColor }), isCollapsedKid ? css("msgItemMailboxCollapsed", { background: styles.accentSoft, color: styles.colorMild }, true) : [], name === full ? [] : attr.title(full), name);
				mailboxtags.push(e);
			}, "addMailboxTag");
			const othermb = otherMailbox(m.MailboxID);
			if (othermb) {
				addMailboxTag(othermb, false);
			}
			if (msgitemView.isCollapsedThreadRoot()) {
				for (const miv of msgitemView.descendants()) {
					const m2 = miv.messageitem.Message;
					if (!mailboxIDs.has(m2.MailboxID) && otherMailbox(m2.MailboxID)) {
						const mb = listMailboxes().find((mb2) => mb2.ID === m2.MailboxID);
						if (!mb) {
							throw new ConsistencyError(ui("missing mailbox for message in thread"));
						}
						addMailboxTag(mb, true);
					}
				}
			}
			const correspondentAddrs = /* @__PURE__ */ __name((miv) => {
				let fromAddrs = miv.messageitem.Envelope.From || [];
				let toAddrs = [];
				if (listMailboxes().find((mb) => mb.ID === miv.messageitem.Message.MailboxID)?.Sent) {
					toAddrs = [...miv.messageitem.Envelope.To || [], ...miv.messageitem.Envelope.CC || [], ...miv.messageitem.Envelope.BCC || []];
				}
				return [fromAddrs, toAddrs];
			}, "correspondentAddrs");
			const correspondents = /* @__PURE__ */ __name(() => {
				let fromAddrs = [];
				let toAddrs = [];
				let junk2 = m.Junk || !!listMailboxes().find((mb) => mb.ID === m.MailboxID && (mb.Name === rejectsMailbox || mb.Junk));
				if (msgitemView.isCollapsedThreadRoot()) {
					;
					[msgitemView, ...msgitemView.descendants()].forEach((miv) => {
						const [fa2, ta2] = correspondentAddrs(miv);
						fromAddrs = [...fromAddrs, ...fa2];
						toAddrs = [...toAddrs, ...ta2];
						junk2 = junk2 || miv.messageitem.Message.Junk;
					});
				} else {
					[fromAddrs, toAddrs] = correspondentAddrs(msgitemView);
				}
				const seen = /* @__PURE__ */ new Set();
				let fa = [];
				let ta = [];
				for (const a of fromAddrs) {
					const k = a.User + "@" + a.Domain.ASCII;
					if (!seen.has(k)) {
						seen.add(k);
						fa.push(a);
					}
				}
				for (const a of toAddrs) {
					const k = a.User + "@" + a.Domain.ASCII;
					if (!seen.has(k)) {
						seen.add(k);
						ta.push(a);
					}
				}
				let title = fa.map((a) => formatAddress(a)).join(", ");
				if (ta.length > 0) {
					if (title) {
						title += ",\n";
					}
					title += ui("addressed: ") + ta.map((a) => formatAddress(a)).join(", ");
				}
				return [
					attr.title(title),
					join([
						...fa.map((a) => new String(formatAddressShort(a, junk2))),
						...ta.map((a) => dom.span(style({ fontStyle: "italic" }), new String(formatAddressShort(a, junk2))))
					], () => ", ")
				];
			}, "correspondents");
			ensureCSS(".msgItem.focus", { borderColor: styles.msgItemFocusBorderColor, borderLeftColor: styles.msgItemFocusBorderColor });
			ensureCSS(".msgItem:hover", { backgroundColor: styles.msgItemHoverBackgroundColor });
			ensureCSS(".msgItem.active", { background: styles.msgItemActiveBackground, borderLeftColor: styles.msgItemActiveBorder });
			const active = msgitemView.root && msgitemView.root.classList.contains("active");
			const focus = msgitemView.root && msgitemView.root.classList.contains("focus");
			const elem = dom.div(
				dom._class("msgItem"),
				active ? dom._class("active") : [],
				focus ? dom._class("focus") : [],
				attr.draggable("true"),
				/* @__PURE__ */ __name(function dragstart(e) {
					if (!msglistView.selected().includes(msgitemView)) {
						e.preventDefault();
						window.alert(ui("Can only drag items in selection."));
						return;
					}
					e.dataTransfer.setData("application/vnd.mox.messages", JSON.stringify(msglistView.selected().map((miv) => [miv.messageitem.Message.MailboxID, miv.messageitem.Message.ID])));
				}, "dragstart"),
				// Thread root with kids can be collapsed/expanded with double click.
				settings.threading !== ThreadMode.ThreadOff && !msgitemView.parent && msgitemView.kids.length > 0 ? /* @__PURE__ */ __name(function dblclick(e) {
					e.stopPropagation();
					if (settings.threading === ThreadMode.ThreadOn) {
						withStatus(ui("Saving thread expand/collapse"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], !msgitemView.collapsed));
					}
					if (msgitemView.collapsed) {
						msglistView.threadExpand(msgitemView);
					} else {
						msglistView.threadCollapse(msgitemView);
						msglistView.viewportEnsureMessages();
					}
				}, "dblclick") : [],
				isUnread() ? dom._class("msgItemUnread") : [],
				// Relevant means not muted and matching the query.
				isRelevant() ? [] : css("msgItemNotRelevant", { opacity: ".4" }),
				dom.div(dom._class("msgItemCell"), dom._class("msgItemFlags"), dom.div(css("msgItemFlagsSpread", { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }), dom.div(flagList(msgitemView)), !msgitemView.parent && msgitemView.kids.length > 0 && msgitemView.collapsed ? dom.clickbutton(dom._class("msgThreadToggle"), "" + (1 + msgitemView.descendants().length), attr.tabindex("-1"), attr.title(ui("Expand thread.")), attr.arialabel(ui("Expand thread.")), /* @__PURE__ */ __name(function click(e) {
					e.stopPropagation();
					if (settings.threading === ThreadMode.ThreadOn) {
						withStatus(ui("Saving thread expanded"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], false));
					}
					msglistView.threadExpand(msgitemView);
				}, "click")) : [], !msgitemView.parent && msgitemView.kids.length > 0 && !msgitemView.collapsed ? dom.clickbutton(dom._class("msgThreadToggle"), threadCollapseIcon(), attr.tabindex("-1"), attr.title(ui("Collapse thread.")), attr.arialabel(ui("Collapse thread.")), /* @__PURE__ */ __name(function click(e) {
					e.stopPropagation();
					if (settings.threading === ThreadMode.ThreadOn) {
						withStatus(ui("Saving thread expanded"), client.ThreadCollapse([msgitemView.messageitem.Message.ID], true));
					}
					msglistView.threadCollapse(msgitemView);
					msglistView.viewportEnsureMessages();
				}, "click")) : [])),
				dom.div(
					dom._class("msgItemCell"),
					dom._class("msgItemMain"),
					dom.div(dom._class("msgItemFromRow"), dom.clickbutton(dom._class("msgItemFlagBtn"), mi2.Message.Flagged ? dom._class("isOn") : [], flagMarkIcon(mi2.Message.Flagged), attr.arialabel(mi2.Message.Flagged ? ui("Remove flag") : ui("Flag message")), attr.title(mi2.Message.Flagged ? ui("Remove flag.") : ui("Flag message.")), /* @__PURE__ */ __name(async function click(e) {
						e.preventDefault();
						e.stopPropagation();
						const id = mi2.Message.ID;
						if (mi2.Message.Flagged) {
							await withStatus(ui("Removing flag"), client.FlagsClear([id], ["\\Flagged"]));
						} else {
							await withStatus(ui("Flagging"), client.FlagsAdd([id], ["\\Flagged"]));
						}
					}, "click")), dom.div(dom._class("silenttitle"), dom._class("msgItemFromText"), correspondents()), identityHeader),
					dom.div(dom._class("msgItemSubjectRow"), dom.div(dom._class("msgItemSubjectText"), threadIndent > 0 ? dom.span(threadChar, style({ paddingLeft: threadIndent / 2 + "em" }), css("msgItemThreadChar", { opacity: ".75", fontWeight: "normal" }), threadCharTitle ? attr.title(threadCharTitle) : []) : [], msgitemView.parent ? [] : new String(mi2.Envelope.Subject || ui("(no subject)"))), dom.div(keywords, mailboxtags)),
					mi2.Message.Preview ? dom.div(dom._class("msgItemPreviewRow"), dom.div(dom._class("msgItemPreviewText"), new String(mi2.Message.Preview))) : [],
					// Thread messages are connected by a vertical bar. The first and last message are
					// only half the height of the item, to indicate start/end, and so it stands out
					// from any thread above/below.
					(msgitemView.parent || msgitemView.kids.length > 0) && !msgitemView.threadRoot().collapsed ? dom.div(css("msgItemThreadBar", { position: "absolute", right: 0, top: 0, bottom: 0, borderRight: "2px solid", borderRightColor: styles.colorMilder }), !msgitemView.parent ? css("msgItemThreadBarFirst", { top: "50%", bottom: "-1px" }) : isThreadLast() ? css("msgItemThreadBarLast", { top: "-1px", bottom: "50%" }) : css("msgItemThreadBarMiddle", { top: "-1px", bottom: "-1px" })) : []
				),
				dom.div(dom._class("msgItemCell"), dom._class("msgItemAge"), age(received())),
				dom.div(dom._class("msgItemHoverActions"), mi2.Message.MailboxID === msglistView.mailboxes().find((box) => box.Trash)?.ID ? dom.clickbutton(dom._class("msgItemHoverIcon"), dom._class("msgItemHoverDanger"), strokeIcon(strokePaths.trash), attr.arialabel(ui("Delete")), attr.title(ui("Permanently delete message.")), /* @__PURE__ */ __name(async function click(e) {
					e.preventDefault();
					e.stopPropagation();
					if (msglistView.selected().includes(msgitemView)) {
						await msglistView.cmdDelete();
						return;
					}
					if (!window.confirm(ui("Are you sure you want to permanently delete?"))) {
						return;
					}
					forgetMovedMessages([mi2.Message.ID]);
					await withStatus(ui("Permanently deleting messages"), client.MessageDelete([mi2.Message.ID]));
				}, "click")) : dom.clickbutton(dom._class("msgItemHoverIcon"), strokeIcon(strokePaths.trash), attr.arialabel(ui("Trash")), attr.title(ui("Move to the Trash mailbox.")), /* @__PURE__ */ __name(async function click(e) {
					e.preventDefault();
					e.stopPropagation();
					if (msglistView.selected().includes(msgitemView)) {
						await msglistView.cmdTrash();
						return;
					}
					const mb = msglistView.mailboxes().find((box) => box.Trash);
					if (!mb) {
						window.alert(ui("No mailbox configured for trash yet."));
						return;
					}
					if (mi2.Message.MailboxID === mb.ID) {
						return;
					}
					await withStatus(ui("Moving to trash mailbox"), client.MessageMove([mi2.Message.ID], mb.ID, true));
					offerMoveUndo([{ id: mi2.Message.ID, mailboxID: mi2.Message.MailboxID }]);
				}, "click")), dom.clickbutton(dom._class("msgItemHoverIcon"), strokeIcon(strokePaths.archive), attr.arialabel(ui("Archive")), attr.title(ui("Move to the Archive mailbox.")), /* @__PURE__ */ __name(async function click(e) {
					e.preventDefault();
					e.stopPropagation();
					if (msglistView.selected().includes(msgitemView)) {
						await msglistView.cmdArchive();
						return;
					}
					const mb = msglistView.mailboxes().find((box) => box.Archive);
					if (!mb) {
						window.alert(ui("No mailbox configured for archiving yet."));
						return;
					}
					if (mi2.Message.MailboxID === mb.ID) {
						return;
					}
					await withStatus(ui("Moving to archive mailbox"), client.MessageMove([mi2.Message.ID], mb.ID, true));
					offerMoveUndo([{ id: mi2.Message.ID, mailboxID: mi2.Message.MailboxID }]);
				}, "click"))),
				/* @__PURE__ */ __name(function click(e) {
					e.preventDefault();
					e.stopPropagation();
					msglistView.click(msgitemView, e.ctrlKey, e.shiftKey);
				}, "click")
			);
			msgitemView.root.replaceWith(elem);
			msgitemView.root = elem;
		}, "render");
		const msgitemView = {
			root: dom.div(),
			messageitem: mi,
			receivedTime,
			kids: [],
			parent: null,
			collapsed: initialCollapsed,
			threadRoot: /* @__PURE__ */ __name(() => {
				let miv = msgitemView;
				while (miv.parent) {
					miv = miv.parent;
				}
				return miv;
			}, "threadRoot"),
			isCollapsedThreadRoot: /* @__PURE__ */ __name(() => !msgitemView.parent && msgitemView.collapsed && msgitemView.kids.length > 0, "isCollapsedThreadRoot"),
			descendants: /* @__PURE__ */ __name(() => {
				let l = [];
				const walk = /* @__PURE__ */ __name((miv) => {
					for (const kmiv of miv.kids) {
						l.push(kmiv);
						walk(kmiv);
					}
				}, "walk");
				walk(msgitemView);
				return l;
			}, "descendants"),
			// We often just need to know if a descendant with certain properties exist. No
			// need to create an array, then call find on it.
			findDescendant: /* @__PURE__ */ __name((matchfn) => {
				const walk = /* @__PURE__ */ __name((miv) => {
					if (matchfn(miv)) {
						return miv;
					}
					for (const kmiv of miv.kids) {
						const r = walk(kmiv);
						if (r) {
							return r;
						}
					}
					return null;
				}, "walk");
				return walk(msgitemView);
			}, "findDescendant"),
			lastDescendant: /* @__PURE__ */ __name(() => {
				let l = msgitemView;
				if (l.kids.length === 0) {
					return null;
				}
				while (l.kids.length > 0) {
					l = l.kids[l.kids.length - 1];
				}
				return l;
			}, "lastDescendant"),
			remove,
			render
		};
		return msgitemView;
	}, "newMsgitemView");
	var attachmentView = null;
	var newMsgView = /* @__PURE__ */ __name((miv, msglistView, listMailboxes, setLocationHash, possibleLabels, messageLoaded, refineKeyword, parsedMessageOpt) => {
		const mi = miv.messageitem;
		const m = mi.Message;
		const fromAddress = mi.Envelope.From && mi.Envelope.From.length === 1 ? formatEmail(mi.Envelope.From[0]) : "";
		let parsedMessageResolve = /* @__PURE__ */ __name(() => {
		}, "parsedMessageResolve");
		let parsedMessageReject = /* @__PURE__ */ __name(() => {
		}, "parsedMessageReject");
		let parsedMessagePromise = new Promise((resolve, reject) => {
			parsedMessageResolve = resolve;
			parsedMessageReject = reject;
		});
		const react = /* @__PURE__ */ __name(async (to, cc, bcc, forward2) => {
			const pm = await parsedMessagePromise;
			let body = "";
			const sel = window.getSelection();
			let haveSel = false;
			if (sel && sel.toString()) {
				body = sel.toString();
				haveSel = true;
			} else if (pm.Texts && pm.Texts.length > 0) {
				body = pm.Texts[0];
			}
			body = body.replace(/\r/g, "").replace(/\n\n\n\n*/g, "\n\n").trim();
			let editOffset = 0;
			if (forward2) {
				const env = mi.Envelope;
				const subject2 = env.Subject ? [env.Subject] : [];
				const date = pm.Headers?.Date || [];
				const from = (env.From || []).map((a) => formatAddress(a));
				const replyTo = (env.ReplyTo || []).map((a) => formatAddress(a));
				const to2 = (env.To || []).map((a) => formatAddress(a));
				const cc2 = (env.CC || []).map((a) => formatAddress(a));
				let prefix = `

---- Forwarded Message ----
`;
				const fields = [
					[ui("Subject:"), subject2],
					[ui("Date:"), date],
					[ui("From:"), from],
					[ui("Reply-To:"), replyTo],
					[ui("To:"), to2],
					[ui("Cc:"), cc2]
				];
				const labelWidth = fields.reduce((n, [k, l]) => l.length === 0 ? n : Math.max(n, k.length), 0);
				const padspace = /* @__PURE__ */ __name((s, size) => s + " ".repeat(Math.max(0, size - s.length)), "padspace");
				const add = /* @__PURE__ */ __name((k, l) => {
					if (l.length === 0) {
						return;
					}
					const last = l.length - 1;
					l.map((v, i) => {
						prefix += padspace(k, labelWidth) + " " + v;
						if (i < last) {
							prefix += ",";
						}
						prefix += "\n";
						k = "";
					});
				}, "add");
				for (const [k, l] of fields) {
					add(k, l);
				}
				body = prefix + "\n" + body;
			} else {
				body = body.split("\n").map((line) => "> " + line).join("\n");
				let sig = accountSettings?.Signature || "";
				if (!accountSettings?.Quoting && haveSel || accountSettings?.Quoting === Quoting.Bottom) {
					body += "\n\n";
					editOffset = body.length;
					body += "\n\n" + sig;
				} else {
					let onWroteLine = "";
					if (mi.Envelope.Date && mi.Envelope.From && mi.Envelope.From.length === 1) {
						const from = mi.Envelope.From[0];
						const name = from.Name || formatEmail(from);
						const dt = mi.Envelope.Date.getFullYear() === 1 ? m.Received : mi.Envelope.Date;
						const datetime = dt.toLocaleString(uiLocale(), { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
						onWroteLine = wroteLine(datetime, name);
					}
					body = "\n\n" + sig + "\n" + onWroteLine + body;
				}
			}
			const subjectPrefix = forward2 ? "Fwd:" : "Re:";
			let subject = mi.Envelope.Subject || "";
			subject = (RegExp("^" + subjectPrefix, "i").test(subject) ? "" : subjectPrefix + " ") + subject;
			const opts = {
				from: mi.Envelope.To || void 0,
				to: to.map((a) => formatAddress(a)),
				cc: cc.map((a) => formatAddress(a)),
				bcc: bcc.map((a) => formatAddress(a)),
				subject,
				body,
				isForward: forward2,
				attachmentsMessageItem: forward2 ? mi : void 0,
				responseMessageID: m.ID,
				isList: m.IsMailingList,
				editOffset,
				// For "send and archive", we only move messages from the current open mailbox
				// (fallback to mailbox of response message for search results) to the archive
				// mailbox. We don't want to move messages in other mailboxes, like Sent, Trash, or
				// for cross-posted messages in other mailboxes.
				archiveReferenceMailboxID: msglistView.activeMailbox()?.ID || m.MailboxID
			};
			compose(opts, listMailboxes, setLocationHash);
		}, "react");
		const reply2 = /* @__PURE__ */ __name(async (all) => {
			const contains = /* @__PURE__ */ __name((l, a) => !!l.find((e) => equalAddress(e, a)), "contains");
			let to = [];
			let cc = [];
			let bcc = [];
			if ((mi.Envelope.From || []).length === 1 && envelopeIdentity(mi.Envelope.From || [])) {
				to = mi.Envelope.To || [];
			} else {
				if (mi.Envelope.ReplyTo && mi.Envelope.ReplyTo.length > 0) {
					to = mi.Envelope.ReplyTo;
				} else {
					to = mi.Envelope.From || [];
				}
				if (all) {
					for (const a of mi.Envelope.To || []) {
						if (!contains(to, a) && !envelopeIdentity([a])) {
							to.push(a);
						}
					}
				}
			}
			if (all) {
				cc = mi.Envelope.CC || [];
				bcc = mi.Envelope.BCC || [];
			}
			cc = cc.filter((a, i) => !envelopeIdentity([a]) && !contains(to, a) && !contains(cc.slice(0, i), a));
			bcc = bcc.filter((a) => !envelopeIdentity([a]));
			await react(to, cc, bcc, false);
		}, "reply");
		const cmdForward = /* @__PURE__ */ __name(async () => {
			react([], [], [], true);
		}, "cmdForward");
		const cmdReplyList = /* @__PURE__ */ __name(async () => {
			const pm = await parsedMessagePromise;
			if (pm.ListReplyAddress) {
				await react([pm.ListReplyAddress], [], [], false);
			}
		}, "cmdReplyList");
		const cmdReply = /* @__PURE__ */ __name(async () => {
			await reply2(false);
		}, "cmdReply");
		const cmdReplyAll = /* @__PURE__ */ __name(async () => {
			await reply2(true);
		}, "cmdReplyAll");
		const cmdPrint = /* @__PURE__ */ __name(async () => {
			if (urlType) {
				window.open("msg/" + m.ID + "/msg" + urlType + "#print", "_blank");
			}
		}, "cmdPrint");
		const cmdOpenNewTab = /* @__PURE__ */ __name(async () => {
			if (urlType) {
				window.open("msg/" + m.ID + "/msg" + urlType, "_blank");
			}
		}, "cmdOpenNewTab");
		const cmdOpenRaw = /* @__PURE__ */ __name(async () => {
			window.open("msg/" + m.ID + "/raw", "_blank");
		}, "cmdOpenRaw");
		const cmdOpenRawPart = /* @__PURE__ */ __name(async () => {
			const pm = await parsedMessagePromise;
			let path = null;
			if (urlType === "text" && pm.TextPaths && pm.TextPaths.length > 0) {
				path = pm.TextPaths[0];
			} else if ((urlType === "html" || urlType === "htmlexternal") && pm.HTMLPath) {
				path = pm.HTMLPath;
			}
			if (!path) {
				window.alert(ui("Part not found."));
				return;
			}
			window.open("msg/" + m.ID + "/viewtext/" + [0, ...path].join("."), "_blank");
		}, "cmdOpenRawPart");
		const cmdDownloadRaw = /* @__PURE__ */ __name(async () => {
			window.open("msg/" + m.ID + "/rawdl", "_blank");
		}, "cmdDownloadRaw");
		const cmdViewAttachments = /* @__PURE__ */ __name(async () => {
			if (attachments.length > 0) {
				view(attachments[0]);
			}
		}, "cmdViewAttachments");
		const cmdComposeDraft = /* @__PURE__ */ __name(async () => {
			const pm = await parsedMessagePromise;
			composeDraft(mi, pm, listMailboxes, setLocationHash);
		}, "cmdComposeDraft");
		const cmdToggleHeaders = /* @__PURE__ */ __name(async () => {
			settingsPut({ ...settings, showAllHeaders: !settings.showAllHeaders });
			const pm = await parsedMessagePromise;
			if (isMobile() && settings.showAllHeaders) {
				msgheaderDetailsExpanded = true;
				msgheaderDetailsElem.classList.add("expanded");
			}
			loadHeaderDetails(pm);
			loadMobileHeaderSummary();
		}, "cmdToggleHeaders");
		let textbtn, htmlbtn, htmlextbtn;
		const activeBtn = /* @__PURE__ */ __name((b) => {
			for (const xb of [textbtn, htmlbtn, htmlextbtn]) {
				if (xb) {
					xb.classList.toggle("active", xb === b);
				}
			}
		}, "activeBtn");
		const fromAddressSettingsSave = /* @__PURE__ */ __name(async (mode) => {
			const froms = mi.Envelope.From || [];
			if (froms.length === 1) {
				await withStatus(ui("Saving view mode settings for address"), client.FromAddressSettingsSave({ FromAddress: froms[0].User + "@" + (froms[0].Domain.Unicode || froms[0].Domain.ASCII), ViewMode: mode }));
			}
		}, "fromAddressSettingsSave");
		const cmdShowText = /* @__PURE__ */ __name(async () => {
			if (!textbtn) {
				return;
			}
			loadText(await parsedMessagePromise);
			activeBtn(textbtn);
			await fromAddressSettingsSave(ViewMode.ModeText);
		}, "cmdShowText");
		const cmdShowHTML = /* @__PURE__ */ __name(async () => {
			if (!htmlbtn || !htmlextbtn) {
				return;
			}
			loadHTML();
			activeBtn(htmlbtn);
			await fromAddressSettingsSave(ViewMode.ModeHTML);
		}, "cmdShowHTML");
		const cmdShowHTMLExternal = /* @__PURE__ */ __name(async () => {
			if (!htmlbtn || !htmlextbtn) {
				return;
			}
			loadHTMLexternal();
			activeBtn(htmlextbtn);
			await fromAddressSettingsSave(ViewMode.ModeHTMLExt);
		}, "cmdShowHTMLExternal");
		const cmdShowHTMLCycle = /* @__PURE__ */ __name(async () => {
			if (urlType === "html") {
				await cmdShowHTMLExternal();
			} else {
				await cmdShowHTML();
			}
		}, "cmdShowHTMLCycle");
		const cmdShowInternals = /* @__PURE__ */ __name(async () => {
			const pm = await parsedMessagePromise;
			const mimepart = /* @__PURE__ */ __name((p) => dom.li((p.MediaType + "/" + p.MediaSubType).toLowerCase(), p.ContentTypeParams ? " " + JSON.stringify(p.ContentTypeParams) : [], p.Parts && p.Parts.length === 0 ? [] : dom.ul(dom._class("internalsList"), (p.Parts || []).map((pp) => mimepart(pp)))), "mimepart");
			const remove = popup(dom.div(dom._class("dialogPanel"), dom._class("internalsPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("MIME internals")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close internals.")), /* @__PURE__ */ __name(function click() {
				remove();
			}, "click"))), dom.div(dom._class("dialogBody"), dom.div(dom._class("internalsColumns"), dom.div(dom.h2(ui("Mime structure")), dom.ul(dom._class("internalsList"), mimepart(pm.Part))), dom.div(dom.h2(ui("Message")), dom.pre(dom._class("internalsPre"), JSON.stringify(m, void 0, "	"))), dom.div(dom.h2(ui("Part")), dom.pre(dom._class("internalsPre"), JSON.stringify(pm.Part, void 0, "	"))))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Close"), /* @__PURE__ */ __name(function click() {
				remove();
			}, "click")))));
		}, "cmdShowInternals");
		const cmdUp = /* @__PURE__ */ __name(async () => {
			msgscrollElem.scrollTo({ top: msgscrollElem.scrollTop - 3 * msgscrollElem.getBoundingClientRect().height / 4, behavior: "smooth" });
		}, "cmdUp");
		const cmdDown = /* @__PURE__ */ __name(async () => {
			msgscrollElem.scrollTo({ top: msgscrollElem.scrollTop + 3 * msgscrollElem.getBoundingClientRect().height / 4, behavior: "smooth" });
		}, "cmdDown");
		const cmdHome = /* @__PURE__ */ __name(async () => {
			msgscrollElem.scrollTo({ top: 0 });
		}, "cmdHome");
		const cmdEnd = /* @__PURE__ */ __name(async () => {
			msgscrollElem.scrollTo({ top: msgscrollElem.scrollHeight });
		}, "cmdEnd");
		const shortcuts = {
			e: cmdComposeDraft,
			I: cmdShowInternals,
			o: cmdOpenNewTab,
			O: cmdOpenRaw,
			"ctrl p": cmdPrint,
			f: cmdForward,
			r: cmdReply,
			R: cmdReplyAll,
			v: cmdViewAttachments,
			t: cmdShowText,
			T: cmdShowHTMLCycle,
			"ctrl i": cmdToggleHeaders,
			"alt j": cmdDown,
			"alt k": cmdUp,
			"alt ArrowDown": cmdDown,
			"alt ArrowUp": cmdUp,
			"alt J": cmdEnd,
			"alt K": cmdHome,
			// For showing shortcuts only, handled in msglistView.
			a: msglistView.cmdArchive,
			d: msglistView.cmdTrash,
			D: msglistView.cmdDelete,
			q: msglistView.cmdJunk,
			Q: msglistView.cmdMarkNotJunk,
			m: msglistView.cmdMarkRead,
			M: msglistView.cmdMarkUnread
		};
		let urlType;
		let msgbuttonElem, msgheaderElem, msgattachmentElem, msgmodeElem;
		let msgheaderFullElem;
		let msgmobileSummaryElem;
		let msgheaderDetailsElem;
		let msgheaderDetailsExpanded = false;
		const msgmetaElem = dom.div(
			css("msgmeta", { backgroundColor: styles.backgroundColorMild, borderBottom: "5px solid", borderBottomColor: ["white", "black"], maxHeight: "90%", overflowY: "auto" }),
			attr.role("region"),
			attr.arialabel(ui("Buttons and headers for message")),
			msgmobileSummaryElem = dom.div(dom._class("msgMobileSummary")),
			msgbuttonElem = dom.div(),
			dom.div(attr.arialive("assertive"), msgheaderDetailsElem = dom.div(dom._class("msgHeaderDetails"), dom.table(styleClasses.msgHeaders, msgheaderElem = dom.tbody()), msgheaderFullElem = dom.table(css("msgHeaderExtra", { width: "100%" }))), msgattachmentElem = dom.div(), msgmodeElem = dom.div()),
			// Explicit separator that separates headers from body, to
			// prevent HTML messages from faking UI elements.
			dom.div(css("headerBodySeparator", { height: "2px", backgroundColor: styles.borderColor }))
		);
		const msgscrollElem = dom.div(dom._class("pad"), yscrollAutoStyle, attr.role("region"), attr.arialabel(ui("Message body")), css("msgscroll", { backgroundColor: styles.backgroundColor }));
		const msgcontentElem = dom.div(css("scrollparent", { position: "relative", flexGrow: "1" }));
		const trashMailboxID = listMailboxes().find((mb) => mb.Trash)?.ID;
		const draftMailboxID = listMailboxes().find((mb) => mb.Draft)?.ID;
		let buttonPm = parsedMessageOpt || null;
		const trashOrDeleteBtn = /* @__PURE__ */ __name(() => m.MailboxID === trashMailboxID ? dom.clickbutton(ui("Delete"), attr.title(ui("Permanently delete message.")), clickCmd(msglistView.cmdDelete, shortcuts)) : dom.clickbutton(ui("Trash"), attr.title(ui("Move to the Trash mailbox.")), clickCmd(msglistView.cmdTrash, shortcuts)), "trashOrDeleteBtn");
		const moreActionsPopover = /* @__PURE__ */ __name((ref) => {
			menuPopover(ref, [
				!buttonPm || !buttonPm.ListReplyAddress ? [] : dom.clickbutton(ui("Reply to list"), attr.title(ui("Compose a reply to this mailing list.")), clickCmd(cmdReplyList, shortcuts)),
				dom.clickbutton(ui("Junk"), attr.title(ui("Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages.")), clickCmd(msglistView.cmdJunk, shortcuts)),
				dom.clickbutton(ui("Move to..."), /* @__PURE__ */ __name(function click(e) {
					movePopover(e, listMailboxes(), [m]);
				}, "click")),
				dom.clickbutton(ui("Labels..."), /* @__PURE__ */ __name(function click(e) {
					labelsPopover(e, [m], possibleLabels);
				}, "click")),
				dom.clickbutton(ui("Print"), attr.title(ui("Print message, opens in new tab and opens print dialog.")), clickCmd(cmdPrint, shortcuts)),
				dom.clickbutton(ui("Mark Not Junk"), attr.title(ui("Mark as not junk, causing this message to be used in spam classification of new incoming messages.")), clickCmd(msglistView.cmdMarkNotJunk, shortcuts)),
				dom.clickbutton(ui("Mark Read"), clickCmd(msglistView.cmdMarkRead, shortcuts)),
				dom.clickbutton(ui("Mark Unread"), clickCmd(msglistView.cmdMarkUnread, shortcuts)),
				dom.clickbutton(ui("Mute thread"), clickCmd(msglistView.cmdMute, shortcuts)),
				dom.clickbutton(ui("Unmute thread"), clickCmd(msglistView.cmdUnmute, shortcuts)),
				dom.clickbutton(ui("Open in new tab"), clickCmd(cmdOpenNewTab, shortcuts)),
				dom.clickbutton(ui("Download raw original message"), clickCmd(cmdDownloadRaw, shortcuts)),
				dom.clickbutton(ui("Export as ..."), /* @__PURE__ */ __name(function click(e) {
					popoverExport(e.target, "", [m.ID]);
				}, "click")),
				dom.clickbutton(ui("Show raw original message in new tab"), clickCmd(cmdOpenRaw, shortcuts)),
				dom.clickbutton(ui("Show currently displayed part as decoded text"), clickCmd(cmdOpenRawPart, shortcuts)),
				dom.clickbutton(ui("Show internals in popup"), clickCmd(cmdShowInternals, shortcuts))
			]);
		}, "moreActionsPopover");
		const loadButtons = /* @__PURE__ */ __name((pm) => {
			buttonPm = pm;
			const oneRecipient = (mi.Envelope.To || []).length <= 1 && (mi.Envelope.CC || []).length === 0 && (mi.Envelope.BCC || []).length === 0;
			const row = dom.div(dom._class("msgActionRow"), m.MailboxID === draftMailboxID ? dom.clickbutton(ui("Edit"), attr.title(ui("Continue editing this draft message.")), clickCmd(cmdComposeDraft, shortcuts)) : [], pm && pm.ListReplyAddress && formatEmail(pm.ListReplyAddress) === fromAddress ? [] : dom.clickbutton(ui("Reply"), attr.title(ui("Compose a reply to the sender of this message.")), clickCmd(cmdReply, shortcuts)), oneRecipient ? [] : dom.clickbutton(ui("Reply all"), attr.title(ui("Compose a reply to all participants of this message.")), clickCmd(cmdReplyAll, shortcuts)), dom.clickbutton(ui("Forward"), attr.title(ui("Compose a forwarding message, optionally including attachments.")), clickCmd(cmdForward, shortcuts)), trashOrDeleteBtn(), dom.clickbutton(ui("Archive"), attr.title(ui("Move to the Archive mailbox.")), clickCmd(msglistView.cmdArchive, shortcuts)), dom.clickbutton(ui("More"), attr.title(ui("More actions.")), /* @__PURE__ */ __name(function click(e) {
				moreActionsPopover(e.target);
			}, "click")));
			dom._kids(msgbuttonElem, isMobile() ? dom.div(dom._class("msgbuttonMobile"), row) : dom.div(dom._class("msgbuttonScroll"), row));
		}, "loadButtons");
		loadButtons(parsedMessageOpt || null);
		const recipientLabel = /* @__PURE__ */ __name((a) => {
			const n = a.Name;
			if (n && !n.includes("<") && !n.includes("@") && !n.includes(">")) {
				return n;
			}
			return formatEmail(a);
		}, "recipientLabel");
		const recipientsShort = /* @__PURE__ */ __name((addrs) => {
			if (addrs.length === 0) {
				return ui("undisclosed recipients");
			}
			const names = addrs.map(recipientLabel);
			if (names.length <= 2) {
				return names.join(", ");
			}
			return names[0] + ", " + names[1] + " +" + (names.length - 2);
		}, "recipientsShort");
		const loadMobileHeaderSummary = /* @__PURE__ */ __name(() => {
			if (!isMobile()) {
				dom._kids(msgmobileSummaryElem, []);
				return;
			}
			const msgenv = mi.Envelope;
			const received = mi.Message.Received;
			const receivedlocal = new Date(received.getTime());
			const dateStr = receivedlocal.toLocaleDateString(uiLocale(), { month: "short", day: "numeric" }) + " " + receivedlocal.toLocaleTimeString(uiLocale(), { hour: "2-digit", minute: "2-digit" });
			const from = (msgenv.From || [])[0];
			const fromStr = from ? formatAddressShort(from, false) : ui("(unknown sender)");
			let toLine = ui("To: ") + recipientsShort(msgenv.To || []);
			const cc = msgenv.CC || [];
			if (cc.length > 0) {
				toLine += ui(" \xB7 Cc: ") + recipientsShort(cc);
			}
			const chips = [];
			if (mi.Message.IsForward) {
				chips.push(dom.span(dom._class("msgMobileSummaryChip"), ui("Forwarded")));
			}
			if (mi.Message.IsMailingList) {
				chips.push(dom.span(dom._class("msgMobileSummaryChip"), ui("Mailing list")));
			}
			if (mi.IsSigned) {
				chips.push(dom.span(dom._class("msgMobileSummaryChip"), ui("Signed")));
			}
			if (mi.IsEncrypted) {
				chips.push(dom.span(dom._class("msgMobileSummaryChip"), ui("Encrypted")));
			}
			if (refineKeyword) {
				for (const kw of mi.Message.Keywords || []) {
					chips.push(dom.clickbutton(dom._class("msgMobileSummaryChip"), kw, /* @__PURE__ */ __name(async function click() {
						await refineKeyword(kw);
					}, "click")));
				}
			}
			dom._kids(msgmobileSummaryElem, dom.div(dom._class("msgMobileSummaryTop"), dom.div(dom._class("msgMobileSummaryFrom"), fromStr), dom.div(dom._class("msgMobileSummaryDate"), attr.title(ui("Received: ") + received.toString() + ";\n" + ui("Date header in message: ") + (msgenv.Date ? msgenv.Date.toString() : ui("(missing/invalid)"))), dateStr)), dom.div(dom._class("msgMobileSummaryMeta"), dom.span(dom._class("msgMobileSummaryTo"), toLine), dom.clickbutton(dom._class("msgMobileDetailsToggle"), msgheaderDetailsExpanded ? ui("Less") : ui("Details"), attr.title(msgheaderDetailsExpanded ? ui("Hide full headers.") : ui("Show full headers.")), /* @__PURE__ */ __name(function click() {
				msgheaderDetailsExpanded = !msgheaderDetailsExpanded;
				msgheaderDetailsElem.classList.toggle("expanded", msgheaderDetailsExpanded);
				loadMobileHeaderSummary();
			}, "click"))), chips.length > 0 ? dom.div(dom._class("msgMobileSummaryChips"), chips) : []);
		}, "loadMobileHeaderSummary");
		loadMsgheaderView(msgheaderElem, miv.messageitem, accountSettings.ShowHeaders || [], refineKeyword, false);
		loadMobileHeaderSummary();
		const headerTextMildStyle = css("headerTextMild", { textAlign: "right", color: styles.colorMild });
		const loadHeaderDetails = /* @__PURE__ */ __name((pm) => {
			const table = dom.table(css("msgHeaderExtra", { width: "100%" }), !settings.showAllHeaders ? [] : Object.entries(pm.Headers || {}).sort().map((t) => (t[1] || []).map((v) => dom.tr(dom.td(t[0] + ":", headerTextMildStyle), dom.td(v)))));
			msgheaderFullElem.replaceWith(table);
			msgheaderFullElem = table;
		}, "loadHeaderDetails");
		const isText = /* @__PURE__ */ __name((a) => ["text", "message"].includes(a.Part.MediaType.toLowerCase()), "isText");
		const isPDF = /* @__PURE__ */ __name((a) => (a.Part.MediaType + "/" + a.Part.MediaSubType).toLowerCase() === "application/pdf", "isPDF");
		const isViewable = /* @__PURE__ */ __name((a) => isText(a) || isImage(a) || isPDF(a), "isViewable");
		const attachments = mi.Attachments || [];
		let beforeViewFocus;
		const view = /* @__PURE__ */ __name((a) => {
			if (!beforeViewFocus) {
				beforeViewFocus = document.activeElement;
			}
			const pathStr = [0].concat(a.Path || []).join(".");
			const index = attachments.indexOf(a);
			const cmdViewPrev = /* @__PURE__ */ __name(async () => {
				if (index > 0) {
					popupRoot.remove();
					view(attachments[index - 1]);
				}
			}, "cmdViewPrev");
			const cmdViewNext = /* @__PURE__ */ __name(async () => {
				if (index < attachments.length - 1) {
					popupRoot.remove();
					view(attachments[index + 1]);
				}
			}, "cmdViewNext");
			const cmdViewFirst = /* @__PURE__ */ __name(async () => {
				popupRoot.remove();
				view(attachments[0]);
			}, "cmdViewFirst");
			const cmdViewLast = /* @__PURE__ */ __name(async () => {
				popupRoot.remove();
				view(attachments[attachments.length - 1]);
			}, "cmdViewLast");
			const cmdViewClose = /* @__PURE__ */ __name(async () => {
				popupRoot.remove();
				if (beforeViewFocus && beforeViewFocus instanceof HTMLElement && beforeViewFocus.parentNode) {
					beforeViewFocus.focus();
				}
				attachmentView = null;
				beforeViewFocus = null;
			}, "cmdViewClose");
			const attachShortcuts = {
				h: cmdViewPrev,
				ArrowLeft: cmdViewPrev,
				l: cmdViewNext,
				ArrowRight: cmdViewNext,
				"0": cmdViewFirst,
				"$": cmdViewLast,
				Escape: cmdViewClose
			};
			const attachmentsArrowStyle = css("attachmentsArrow", { color: styles.backgroundColor, backgroundColor: styles.color, width: "2em", height: "2em", borderRadius: "1em", lineHeight: "2em", textAlign: "center", fontWeight: "bold" });
			const attachmentsIframeStyle = css("attachmentsIframe", { flexGrow: 1, boxShadow: styles.boxShadow, margin: "0 5em" });
			let content;
			const popupRoot = dom.div(css("attachmentsOverlay", { position: "fixed", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: styles.overlayBackgroundColor, display: "flex", flexDirection: "column", alignContent: "stretch", padding: "1em", zIndex: zindexes.attachments }), /* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
				cmdViewClose();
			}, "click"), attr.tabindex("0"), !(index > 0) ? [] : dom.div(css("attachmentsPrevious", { position: "absolute", left: "1em", top: 0, bottom: 0, fontSize: "1.5em", width: "2em", display: "flex", alignItems: "center", cursor: "pointer" }), dom.div(dom._class("silenttitle"), attachmentsArrowStyle, attr.title(ui("To previous viewable attachment.")), "\u2190"), attr.tabindex("0"), clickCmd(cmdViewPrev, attachShortcuts), enterCmd(cmdViewPrev, attachShortcuts)), dom.div(css("attachmentsDownloadHeaderBox", { textAlign: "center", paddingBottom: "30px" }), dom.span(dom._class("pad"), /* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
			}, "click"), css("attachmentsDownloadHeader", { display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", backgroundColor: styles.popupBackgroundColor, color: styles.popupColor, boxShadow: styles.boxShadow, border: "1px solid", borderColor: styles.popupBorderColor, borderRadius: styles.radius }), dom.span(a.Filename || ui("(unnamed)")), dom.span("\xB7", style({ color: styles.colorMilder })), dom.span(formatSize(a.Part.DecodedSize)), dom.a(dom._class("button"), ui("Download"), attr.download(""), attr.href("msg/" + m.ID + "/download/" + pathStr), /* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
			}, "click")))), isImage(a) ? dom.div(css("attachmentsImageBox", { flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", maxHeight: "calc(100% - 50px)", margin: "0 5em" }), dom.img(css("attachmentsImage", { maxWidth: "100%", maxHeight: "100%", boxShadow: styles.boxShadow, margin: "0 30px" }), attr.src("msg/" + m.ID + "/view/" + pathStr))) : isText(a) ? dom.iframe(attr.title(ui("Attachment shown as text.")), attachmentsIframeStyle, attr.src("msg/" + m.ID + "/viewtext/" + pathStr)) : isPDF(a) ? dom.iframe(attr.title(ui("Attachment as PDF.")), attachmentsIframeStyle, attr.src("msg/" + m.ID + "/view/" + pathStr)) : content = dom.div(/* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
			}, "click"), css("attachmentsBinary", { minWidth: "30em", padding: "2ex", boxShadow: styles.boxShadow, backgroundColor: styles.popupBackgroundColor, margin: "0 5em", textAlign: "center" }), dom.div(style({ marginBottom: "2ex" }), ui("Attachment could be a binary file.")), dom.clickbutton(ui("View as text"), /* @__PURE__ */ __name(function click() {
				content.replaceWith(dom.iframe(attr.title(ui("Attachment shown as text, though it could be a binary file.")), attachmentsIframeStyle, attr.src("msg/" + m.ID + "/viewtext/" + pathStr)));
			}, "click"))), !(index < attachments.length - 1) ? [] : dom.div(css("attachmentsNext", { position: "absolute", right: "1em", top: 0, bottom: 0, fontSize: "1.5em", width: "2em", display: "flex", alignItems: "center", cursor: "pointer" }), dom.div(dom._class("silenttitle"), attachmentsArrowStyle, attr.title(ui("To next viewable attachment.")), "\u2192"), attr.tabindex("0"), clickCmd(cmdViewNext, attachShortcuts), enterCmd(cmdViewNext, attachShortcuts)));
			document.body.appendChild(popupRoot);
			popupRoot.focus();
			attachmentView = { key: keyHandler(attachShortcuts) };
		}, "view");
		var filesAll = false;
		const renderAttachments = /* @__PURE__ */ __name(() => {
			const l = mi.Attachments || [];
			dom._kids(msgattachmentElem, l && l.length === 0 ? [] : dom.div(css("inlineAttachmentsSeparator", { borderTop: "1px solid", borderTopColor: styles.borderColor }), dom.div(dom._class("pad"), dom._class("inlineAttachmentsLine"), ui("Attachments: "), l.slice(0, filesAll ? l.length : 4).map((a) => {
				const name = a.Filename || ui("(unnamed)");
				const viewable = isViewable(a);
				const size = formatSize(a.Part.DecodedSize);
				const eye = "\u{1F441}";
				const dl = "\u2913";
				const dlurl = "msg/" + m.ID + "/download/" + [0].concat(a.Path || []).join(".");
				const viewbtn = dom.clickbutton(eye, viewable ? " " + new String(name) : [], attr.title(ui("View this file. Size: ") + size), /* @__PURE__ */ __name(function click() {
					view(a);
				}, "click"));
				const dlbtn = dom.a(dom._class("button"), attr.download(""), attr.href(dlurl), dl, viewable ? [] : " " + new String(name), attr.title(ui("Download this file. Size: ") + size));
				return dom.span(dom._class("btngroup"), urlType === "text" && isImage(a) ? style({ opacity: ".6" }) : [], viewbtn, dlbtn);
			}), filesAll || l.length < 6 ? [] : dom.clickbutton(ui("More..."), /* @__PURE__ */ __name(function click() {
				filesAll = true;
				renderAttachments();
			}, "click")), " ", dom.a(ui("Download all as zip"), attr.download(""), style({ color: "inherit" }), attr.href("msg/" + m.ID + "/attachments.zip")))));
		}, "renderAttachments");
		renderAttachments();
		const root = dom.div(css("msgViewRoot", { position: "absolute", top: 0, right: 0, bottom: 0, left: 0, display: "flex", flexDirection: "column" }));
		dom._kids(root, msgmetaElem, msgcontentElem);
		const loadText = /* @__PURE__ */ __name((pm) => {
			urlType = "text";
			const elem = dom.div(dom._class("mono", "textmulti"), style({ whiteSpace: "pre-wrap" }), (pm.Texts || []).map((t) => renderText(t.replace(/\r\n/g, "\n"))), (mi.Attachments || []).filter((f) => isImage(f)).map((f) => {
				const pathStr = [0].concat(f.Path || []).join(".");
				return dom.div(dom.div(css("msgAttachmentBox", { flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", maxHeight: "calc(100% - 50px)" }), dom.img(attr.src("msg/" + m.ID + "/view/" + pathStr), attr.title(f.Filename), css("msgInlineImage", { boxShadow: styles.boxShadow, maxWidth: "100%", maxHeight: "100%" }))));
			}));
			dom._kids(msgcontentElem);
			dom._kids(msgscrollElem, elem);
			dom._kids(msgcontentElem, msgscrollElem);
			renderAttachments();
		}, "loadText");
		const loadHTML = /* @__PURE__ */ __name(() => {
			urlType = "html";
			dom._kids(msgcontentElem, dom.iframe(attr.tabindex("0"), attr.title(ui("HTML version of message with images inlined, without external resources loaded.")), attr.src("msg/" + m.ID + "/" + urlType), css("msgIframeHTML", { position: "absolute", width: "100%", height: "100%" })));
			renderAttachments();
		}, "loadHTML");
		const loadHTMLexternal = /* @__PURE__ */ __name(() => {
			urlType = "htmlexternal";
			dom._kids(msgcontentElem, dom.iframe(attr.tabindex("0"), attr.title(ui("HTML version of message with images inlined and with external resources loaded.")), attr.src("msg/" + m.ID + "/" + urlType), css("msgIframeHTML", { position: "absolute", width: "100%", height: "100%" })));
			renderAttachments();
		}, "loadHTMLexternal");
		const mv = {
			root,
			messageitem: mi,
			key: keyHandler(shortcuts),
			aborter: { abort: /* @__PURE__ */ __name(() => {
			}, "abort") },
			updateKeywords: /* @__PURE__ */ __name(async (modseq, keywords) => {
				mi.Message.ModSeq = modseq;
				mi.Message.Keywords = keywords;
				loadMsgheaderView(msgheaderElem, miv.messageitem, accountSettings.ShowHeaders || [], refineKeyword, false);
				loadMobileHeaderSummary();
			}, "updateKeywords")
		};
		(async () => {
			let pm;
			if (parsedMessageOpt) {
				pm = parsedMessageOpt;
				parsedMessageResolve(pm);
			} else {
				const promise = withStatus(ui("Loading message"), client.withOptions({ aborter: mv.aborter }).ParsedMessage(m.ID));
				try {
					pm = await promise;
				} catch (err) {
					if (err instanceof Error) {
						parsedMessageReject(err);
					} else {
						parsedMessageReject(new Error(ui("fetching message failed")));
					}
					throw err;
				}
				parsedMessageResolve(pm);
			}
			loadButtons(pm);
			loadHeaderDetails(pm);
			const msgHeaderSeparatorStyle = css("msgHeaderSeparator", { borderTop: "1px solid", borderTopColor: styles.borderColor });
			const msgModeWarningStyle = css("msgModeWarning", { backgroundColor: styles.warningBackgroundColor, padding: "0 .15em" });
			const htmlNote = ui("In the HTML viewer, the following potentially dangerous functionality is disabled: submitting forms, starting a download from a link, navigating away from this page by clicking a link. If a link does not work, try explicitly opening it in a new tab.");
			const haveText = pm.Texts && pm.Texts.length > 0;
			if (!haveText && !pm.HasHTML) {
				dom._kids(msgcontentElem);
				dom._kids(msgmodeElem, dom.div(dom._class("pad"), msgHeaderSeparatorStyle, dom.span(ui("No textual content"), msgModeWarningStyle)));
			} else if (haveText && !pm.HasHTML) {
				loadText(pm);
				dom._kids(msgmodeElem);
			} else {
				const text = haveText && pm.ViewMode == ViewMode.ModeText;
				dom._kids(msgmodeElem, dom.div(dom._class("pad"), dom._class("msgModeBar"), msgHeaderSeparatorStyle, !haveText ? dom.span(ui("HTML-only message"), attr.title(htmlNote), msgModeWarningStyle) : [], dom.span(dom._class("btngroup"), haveText ? textbtn = dom.clickbutton(text ? dom._class("active") : [], ui("Text"), clickCmd(cmdShowText, shortcuts)) : [], htmlbtn = dom.clickbutton(text || !text && pm.ViewMode == ViewMode.ModeHTMLExt ? [] : dom._class("active"), ui("HTML"), attr.title(htmlNote), /* @__PURE__ */ __name(async function click() {
					showShortcut("T");
					await cmdShowHTML();
				}, "click")), htmlextbtn = dom.clickbutton(text || !text && pm.ViewMode != ViewMode.ModeHTMLExt ? [] : dom._class("active"), isMobile() ? ui("HTML ext") : ui("HTML with external resources"), attr.title(htmlNote), clickCmd(cmdShowHTMLExternal, shortcuts)))));
				if (text) {
					loadText(pm);
				} else if (pm.ViewMode == ViewMode.ModeHTMLExt) {
					loadHTMLexternal();
				} else {
					loadHTML();
				}
			}
			messageLoaded();
			const tidAdd = /* @__PURE__ */ __name((tid) => {
				const l = scheduledTimers.get(miv.messageitem.Message.ID) || [];
				l.push(tid);
				scheduledTimers.set(miv.messageitem.Message.ID, l);
			}, "tidAdd");
			const tidRemove = /* @__PURE__ */ __name((tid) => {
				const l = scheduledTimers.get(miv.messageitem.Message.ID) || [];
				const i = l.indexOf(tid);
				if (i >= 0) {
					l.splice(i, 1);
				}
				if (l.length === 0) {
					scheduledTimers.delete(miv.messageitem.Message.ID);
				}
			}, "tidRemove");
			if (!miv.messageitem.Message.Seen) {
				const tid = window.setTimeout(async () => {
					if (!miv.messageitem.Message.Seen && miv.messageitem.Message.ID === msglistView.activeMessageID()) {
						await withStatus(ui("Marking current message as read"), client.FlagsAdd([miv.messageitem.Message.ID], ["\\seen"]));
					}
					tidRemove(tid);
				}, 500);
				tidAdd(tid);
			}
			if (!miv.messageitem.Message.Junk && !miv.messageitem.Message.Notjunk) {
				const tid = window.setTimeout(async () => {
					const mailboxSpecial = /* @__PURE__ */ __name(() => !!listMailboxes().find((mb) => mb.ID === miv.messageitem.Message.MailboxID && (mb.Name === rejectsMailbox || mb.Name == introboxMailbox)), "mailboxSpecial");
					if (!miv.messageitem.Message.Junk && !miv.messageitem.Message.Notjunk && miv.messageitem.Message.Seen && miv.messageitem.Message.ID === msglistView.activeMessageID() && !mailboxSpecial()) {
						await withStatus(ui("Marking current message as not junk"), client.FlagsAdd([miv.messageitem.Message.ID], ["$notjunk"]));
					}
					tidRemove(tid);
				}, 5 * 1e3);
				tidAdd(tid);
			}
		})();
		return mv;
	}, "newMsgView");
	var newMsglistView = /* @__PURE__ */ __name((msgElem, activeMailbox, listMailboxes, setLocationHash, otherMailbox, possibleLabels, scrollElemHeight, refineKeyword, viewportEnsureMessages, onMessagePane) => {
		let msgitemViews = [];
		let collapsedMsgitemViews = [];
		let oldThreadMessageItems = [];
		let selected = [];
		let focus = null;
		let msgView = null;
		const moveActionSources = /* @__PURE__ */ __name((skipMBID) => {
			const sentMailboxID = listMailboxes().find((mb) => mb.Sent)?.ID;
			const effselected = mlv.selected();
			return effselected.filter((miv) => miv.messageitem.Message.MailboxID !== skipMBID).map((miv) => miv.messageitem.Message).filter((m) => effselected.length === 1 || !sentMailboxID || m.MailboxID !== sentMailboxID || !otherMailbox(sentMailboxID)).map((m) => ({ id: m.ID, mailboxID: m.MailboxID }));
		}, "moveActionSources");
		const cmdArchive = /* @__PURE__ */ __name(async () => {
			const mb = listMailboxes().find((mb2) => mb2.Archive);
			if (mb) {
				const sources = moveActionSources(mb.ID);
				await withStatus(ui("Moving to archive mailbox"), client.MessageMove(sources.map((s) => s.id), mb.ID, true));
				offerMoveUndo(sources);
			} else {
				window.alert(ui("No mailbox configured for archiving yet."));
			}
		}, "cmdArchive");
		const cmdDelete = /* @__PURE__ */ __name(async () => {
			if (!window.confirm(ui("Are you sure you want to permanently delete?"))) {
				return;
			}
			const ids = mlv.selected().map((miv) => miv.messageitem.Message.ID);
			forgetMovedMessages(ids);
			for (const id of ids) {
				for (const tid of scheduledTimers.get(id) || []) {
					window.clearTimeout(tid);
				}
				scheduledTimers.delete(id);
			}
			await withStatus(ui("Permanently deleting messages"), client.MessageDelete(ids));
		}, "cmdDelete");
		const cmdTrash = /* @__PURE__ */ __name(async () => {
			const mb = listMailboxes().find((mb2) => mb2.Trash);
			if (mb) {
				const sources = moveActionSources(mb.ID);
				await withStatus(ui("Moving to trash mailbox"), client.MessageMove(sources.map((s) => s.id), mb.ID, true));
				offerMoveUndo(sources);
			} else {
				window.alert(ui("No mailbox configured for trash yet."));
			}
		}, "cmdTrash");
		const cmdJunk = /* @__PURE__ */ __name(async () => {
			const mb = listMailboxes().find((mb2) => mb2.Junk);
			if (mb) {
				const sources = moveActionSources(mb.ID);
				await withStatus(ui("Moving to junk mailbox"), client.MessageMove(sources.map((s) => s.id), mb.ID, true));
				offerMoveUndo(sources);
			} else {
				window.alert(ui("No mailbox configured for junk yet."));
			}
		}, "cmdJunk");
		const cmdMarkNotJunk = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Marking as not junk"), client.FlagsAdd(mlv.selected().map((miv) => miv.messageitem.Message.ID), ["$notjunk"]));
		}, "cmdMarkNotJunk");
		const cmdMarkRead = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Marking as read"), client.FlagsAdd(mlv.selected().map((miv) => miv.messageitem.Message.ID), ["\\seen"]));
		}, "cmdMarkRead");
		const cmdMarkUnread = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Marking as not read"), client.FlagsClear(mlv.selected().map((miv) => miv.messageitem.Message.ID), ["\\seen", "$junk", "$notjunk"]));
		}, "cmdMarkUnread");
		const cmdMute = /* @__PURE__ */ __name(async () => {
			const l = mlv.selected();
			await withStatus(ui("Muting thread"), client.ThreadMute(l.map((miv) => miv.messageitem.Message.ID), true));
			const oldstate = state();
			for (const miv of l) {
				if (!miv.parent && miv.kids.length > 0 && !miv.collapsed) {
					threadCollapse(miv, false);
				}
			}
			updateState(oldstate);
			viewportEnsureMessages();
		}, "cmdMute");
		const cmdUnmute = /* @__PURE__ */ __name(async () => {
			await withStatus(ui("Unmuting thread"), client.ThreadMute(mlv.selected().map((miv) => miv.messageitem.Message.ID), false));
		}, "cmdUnmute");
		const selectedRoots = /* @__PURE__ */ __name(() => {
			const mivs = [];
			mlv.selected().forEach((miv) => {
				const mivroot = miv.threadRoot();
				if (!mivs.includes(mivroot)) {
					mivs.push(mivroot);
				}
			});
			return mivs;
		}, "selectedRoots");
		const cmdToggleMute = /* @__PURE__ */ __name(async () => {
			if (settings.threading === ThreadMode.ThreadOff) {
				alert(ui("Toggle muting threads is only available when threading is enabled."));
				return;
			}
			const rootmivs = selectedRoots();
			const unmuted = !!rootmivs.find((miv) => !miv.messageitem.Message.ThreadMuted);
			await withStatus(unmuted ? "Muting" : "Unmuting", client.ThreadMute(rootmivs.map((miv) => miv.messageitem.Message.ID), unmuted ? true : false));
			if (unmuted) {
				const oldstate = state();
				rootmivs.forEach((miv) => {
					if (!miv.collapsed) {
						threadCollapse(miv, false);
					}
				});
				updateState(oldstate);
				viewportEnsureMessages();
			}
		}, "cmdToggleMute");
		const cmdToggleCollapse = /* @__PURE__ */ __name(async () => {
			if (settings.threading === ThreadMode.ThreadOff) {
				alert(ui("Toggling thread collapse/expand is only available when threading is enabled."));
				return;
			}
			const rootmivs = selectedRoots();
			const collapse = !!rootmivs.find((miv) => !miv.collapsed);
			const oldstate = state();
			if (collapse) {
				rootmivs.forEach((miv) => {
					if (!miv.collapsed) {
						threadCollapse(miv, false);
					}
				});
				selected = rootmivs;
				if (focus) {
					focus = focus.threadRoot();
				}
				viewportEnsureMessages();
			} else {
				rootmivs.forEach((miv) => {
					if (miv.collapsed) {
						threadExpand(miv, false);
					}
				});
			}
			updateState(oldstate);
			if (settings.threading === ThreadMode.ThreadOn) {
				const action = collapse ? "Collapsing" : "Expanding";
				await withStatus(action, client.ThreadCollapse(rootmivs.map((miv) => miv.messageitem.Message.ID), collapse));
			}
		}, "cmdToggleCollapse");
		const cmdSelectThread = /* @__PURE__ */ __name(async () => {
			if (!focus) {
				return;
			}
			const oldstate = state();
			selected = msgitemViews.filter((miv) => miv.messageitem.Message.ThreadID === focus.messageitem.Message.ThreadID);
			updateState(oldstate);
		}, "cmdSelectThread");
		const cmdCollapseExpand = /* @__PURE__ */ __name(async (collapse) => {
			if (settings.threading === ThreadMode.ThreadOff) {
				alert(ui("Toggling thread collapse/expand is only available when threading is enabled."));
				return;
			}
			const oldstate = state();
			const rootmivs = selectedRoots();
			rootmivs.forEach((miv) => {
				if (miv.collapsed !== collapse) {
					if (collapse) {
						threadCollapse(miv, false);
					} else {
						threadExpand(miv, false);
					}
				}
			});
			if (collapse) {
				selected = rootmivs;
				if (focus) {
					focus = focus.threadRoot();
				}
			}
			viewportEnsureMessages();
			updateState(oldstate);
			if (settings.threading === ThreadMode.ThreadOn) {
				const action = collapse ? "Collapsing" : "Expanding";
				await withStatus(action, client.ThreadCollapse(rootmivs.map((miv) => miv.messageitem.Message.ID), collapse));
			}
		}, "cmdCollapseExpand");
		const cmdCollapse = /* @__PURE__ */ __name(async () => cmdCollapseExpand(true), "cmdCollapse");
		const cmdExpand = /* @__PURE__ */ __name(async () => cmdCollapseExpand(false), "cmdExpand");
		const shortcuts = {
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
			ArrowRight: cmdExpand
		};
		const checkConsistency = /* @__PURE__ */ __name((checkSelection) => {
			if (!settings.checkConsistency) {
				return;
			}
			const mivseen = /* @__PURE__ */ new Set();
			const threadActive = /* @__PURE__ */ new Set();
			for (const miv of msgitemViews) {
				const id = miv.messageitem.Message.ID;
				if (mivseen.has(id)) {
					log("duplicate Message.ID", { id, mivseenSize: mivseen.size });
					throw new ConsistencyError("duplicate Message.ID in msgitemViews");
				}
				mivseen.add(id);
				if (!miv.root.parentNode) {
					throw new ConsistencyError("msgitemView.root not in dom");
				}
				threadActive.add(miv.messageitem.Message.ThreadID);
			}
			const colseen = /* @__PURE__ */ new Set();
			for (const miv of collapsedMsgitemViews) {
				const id = miv.messageitem.Message.ID;
				if (colseen.has(id)) {
					throw new ConsistencyError("duplicate Message.ID in collapsedMsgitemViews");
				}
				colseen.add(id);
				if (mivseen.has(id)) {
					throw new ConsistencyError("Message.ID in both collapsedMsgitemViews and msgitemViews");
				}
				threadActive.add(miv.messageitem.Message.ThreadID);
			}
			if (settings.threading !== ThreadMode.ThreadOff) {
				const oldseen = /* @__PURE__ */ new Set();
				for (const mi of oldThreadMessageItems) {
					const id = mi.Message.ID;
					if (oldseen.has(id)) {
						throw new ConsistencyError("duplicate Message.ID in oldThreadMessageItems");
					}
					oldseen.add(id);
					if (mivseen.has(id)) {
						throw new ConsistencyError("Message.ID in both msgitemViews and oldThreadMessageItems");
					}
					if (colseen.has(id)) {
						throw new ConsistencyError("Message.ID in both collapsedMsgitemViews and oldThreadMessageItems");
					}
					if (threadActive.has(mi.Message.ThreadID)) {
						throw new ConsistencyError("threadid both in active and in old thread list");
					}
				}
			}
			msgitemViews.forEach((miv, i) => {
				if (miv.collapsed) {
					for (const dmiv of miv.descendants()) {
						if (!colseen.has(dmiv.messageitem.Message.ID)) {
							throw new ConsistencyError("descendant message id missing from collapsedMsgitemViews");
						}
					}
					return;
				}
				for (const dmiv of miv.descendants()) {
					i++;
					if (!mivseen.has(dmiv.messageitem.Message.ID)) {
						throw new ConsistencyError("descendant missing from msgitemViews");
					}
					if (msgitemViews[i] !== dmiv) {
						throw new ConsistencyError("descendant not at expected position in msgitemViews");
					}
				}
			});
			if (!checkSelection) {
				return;
			}
			const selseen = /* @__PURE__ */ new Set();
			for (const miv of selected) {
				const id = miv.messageitem.Message.ID;
				if (selseen.has(id)) {
					throw new ConsistencyError("duplicate miv in selected");
				}
				selseen.add(id);
				if (!mivseen.has(id)) {
					throw new ConsistencyError("selected id not in msgitemViews");
				}
			}
			if (focus) {
				const id = focus.messageitem.Message.ID;
				if (!mivseen.has(id)) {
					throw new ConsistencyError("focus set to unknown miv");
				}
			}
		}, "checkConsistency");
		const state = /* @__PURE__ */ __name(() => {
			const active = {};
			for (const miv of mlv.selected()) {
				active[miv.messageitem.Message.ID] = miv;
			}
			return { active, focus };
		}, "state");
		const listActionBar = dom.div(dom._class("msgListActionBar"), attr.role("region"), attr.arialabel("Actions for selected messages"));
		const fillListActionBar = /* @__PURE__ */ __name((rows) => {
			if (rows.length < 2) {
				listActionBar.classList.remove("isOpen");
				dom._kids(listActionBar);
				return;
			}
			const trashMailboxID = listMailboxes().find((mb) => mb.Trash)?.ID;
			const allTrash = trashMailboxID && !rows.find((miv) => miv.messageitem.Message.MailboxID !== trashMailboxID);
			const sentMailboxID = listMailboxes().find((mb) => mb.Sent)?.ID;
			const movable = rows.map((miv) => miv.messageitem.Message).filter((m) => rows.length === 1 || !sentMailboxID || m.MailboxID !== sentMailboxID || !otherMailbox(sentMailboxID));
			listActionBar.classList.add("isOpen");
			dom._kids(listActionBar, dom.clickbutton(ui("Archive"), attr.title(ui("Move to the Archive mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdArchive, shortcuts)), allTrash ? dom.clickbutton(ui("Delete"), attr.title(ui("Permanently delete messages.")), clickCmd(cmdDelete, shortcuts)) : dom.clickbutton(ui("Trash"), attr.title(ui("Move to the Trash mailbox. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdTrash, shortcuts)), dom.clickbutton(ui("More"), attr.title(ui("More actions.")), /* @__PURE__ */ __name(function click(e) {
				menuPopover(e.target, [
					dom.clickbutton(ui("Junk"), attr.title(ui("Move to Junk mailbox, marking as junk and causing this message to be used in spam classification of new incoming messages. Messages in the designated Sent mailbox are only moved if a single message is selected, or the current mailbox is the Sent mailbox.")), clickCmd(cmdJunk, shortcuts)),
					dom.clickbutton(ui("Move to..."), /* @__PURE__ */ __name(function click2(ev) {
						movePopover(ev, listMailboxes(), movable);
					}, "click")),
					dom.clickbutton(ui("Labels..."), attr.title(ui("Add/remove labels ...")), /* @__PURE__ */ __name(function click2(ev) {
						labelsPopover(ev, rows.map((miv) => miv.messageitem.Message), possibleLabels);
					}, "click")),
					dom.clickbutton(ui("Mark Read"), clickCmd(cmdMarkRead, shortcuts)),
					dom.clickbutton(ui("Mark Unread"), clickCmd(cmdMarkUnread, shortcuts)),
					dom.clickbutton(ui("Mark Not Junk"), attr.title(ui("Mark as not junk, causing this message to be used in spam classification of new incoming messages.")), clickCmd(cmdMarkNotJunk, shortcuts)),
					dom.clickbutton(ui("Mute thread"), clickCmd(cmdMute, shortcuts)),
					dom.clickbutton(ui("Unmute thread"), clickCmd(cmdUnmute, shortcuts)),
					dom.clickbutton(ui("Export as..."), /* @__PURE__ */ __name(function click2(ev) {
						popoverExport(ev.target, "", rows.map((miv) => miv.messageitem.Message.ID));
					}, "click"))
				]);
			}, "click")));
		}, "fillListActionBar");
		const updateState = /* @__PURE__ */ __name(async (oldstate, initial, parsedMessageOpt) => {
			const newstate = state();
			if (oldstate.focus !== newstate.focus) {
				if (oldstate.focus) {
					oldstate.focus.root.classList.toggle("focus", false);
				}
				if (newstate.focus) {
					newstate.focus.root.classList.toggle("focus", true);
					newstate.focus.root.scrollIntoView({ block: initial ? "center" : "nearest" });
				}
			}
			let activeChanged = false;
			for (const id in oldstate.active) {
				if (!newstate.active[id]) {
					oldstate.active[id].root.classList.toggle("active", false);
					activeChanged = true;
				}
			}
			for (const id in newstate.active) {
				if (!oldstate.active[id]) {
					newstate.active[id].root.classList.toggle("active", true);
					activeChanged = true;
				}
			}
			const effselected = mlv.selected();
			if (initial && effselected.length === 1) {
				mlv.redraw(effselected[0]);
			}
			checkConsistency(true);
			if (!activeChanged) {
				return;
			}
			if (msgView) {
				msgView.aborter.abort();
			}
			msgView = null;
			fillListActionBar(effselected);
			if (effselected.length === 0) {
				dom._kids(msgElem);
			} else if (effselected.length === 1) {
				msgElem.classList.toggle("loading", true);
				const loaded = /* @__PURE__ */ __name(() => {
					msgElem.classList.toggle("loading", false);
				}, "loaded");
				msgView = newMsgView(effselected[0], mlv, listMailboxes, setLocationHash, possibleLabels, loaded, refineKeyword, parsedMessageOpt);
				dom._kids(msgElem, msgView);
			} else {
				dom._kids(msgElem, dom.div(attr.role("region"), attr.arialabel(ui("Selected messages")), css("msgSelectionNote", { padding: "2em", textAlign: "center", color: styles.colorMild }), selectedTitle(effselected.length)));
			}
			setLocationHash();
			if (activeChanged && onMessagePane && isMobile()) {
				onMessagePane(effselected.length === 1);
			}
		}, "updateState");
		const moveFocus = /* @__PURE__ */ __name((miv) => {
			const oldstate = state();
			focus = miv;
			updateState(oldstate);
		}, "moveFocus");
		const threadExpand = /* @__PURE__ */ __name((miv, changeState) => {
			if (miv.parent) {
				throw new ConsistencyError("cannot expand non-root");
			}
			const oldstate = state();
			miv.collapsed = false;
			const mivl = miv.descendants();
			miv.render();
			mivl.forEach((dmiv) => dmiv.render());
			for (const miv2 of mivl) {
				collapsedMsgitemViews.splice(collapsedMsgitemViews.indexOf(miv2), 1);
			}
			const pi = msgitemViews.indexOf(miv);
			msgitemViews.splice(pi + 1, 0, ...mivl);
			const next = miv.root.nextSibling;
			for (const miv2 of mivl) {
				mlv.root.insertBefore(miv2.root, next);
			}
			if (changeState) {
				updateState(oldstate);
			}
		}, "threadExpand");
		const threadCollapse = /* @__PURE__ */ __name((miv, changeState) => {
			if (miv.parent) {
				throw new ConsistencyError("cannot expand non-root");
			}
			const oldstate = state();
			miv.collapsed = true;
			const mivl = miv.descendants();
			collapsedMsgitemViews.push(...mivl);
			let select = [miv, ...mivl].find((xmiv) => selected.indexOf(xmiv) >= 0);
			let seli = selected.length;
			msgitemViews.splice(msgitemViews.indexOf(miv) + 1, mivl.length);
			for (const dmiv of mivl) {
				dmiv.remove();
				if (focus === dmiv) {
					focus = miv;
				}
				const si = selected.indexOf(dmiv);
				if (si >= 0) {
					if (si < seli) {
						seli = si;
					}
					selected.splice(si, 1);
				}
			}
			if (select) {
				const si = selected.indexOf(miv);
				if (si < 0) {
					selected.splice(seli, 0, miv);
				}
			}
			if (changeState) {
				updateState(oldstate);
			}
			miv.render();
		}, "threadCollapse");
		const threadToggle = /* @__PURE__ */ __name(() => {
			const oldstate = state();
			const roots = msgitemViews.filter((miv) => !miv.parent && miv.kids.length > 0);
			roots.forEach((miv) => {
				let wantCollapsed = miv.messageitem.Message.ThreadCollapsed;
				if (settings.threading === ThreadMode.ThreadUnread) {
					wantCollapsed = !miv.messageitem.Message.Seen && !miv.findDescendant((miv2) => !miv2.messageitem.Message.Seen);
				}
				if (miv.collapsed === wantCollapsed) {
					return;
				}
				if (wantCollapsed) {
					threadCollapse(miv, false);
				} else {
					threadExpand(miv, false);
				}
			});
			updateState(oldstate);
			viewportEnsureMessages();
		}, "threadToggle");
		const removeSelected = /* @__PURE__ */ __name((miv) => {
			const si = selected.indexOf(miv);
			if (si >= 0) {
				selected.splice(si, 1);
			}
			if (focus === miv) {
				const i = msgitemViews.indexOf(miv);
				if (i + 1 < msgitemViews.length) {
					focus = msgitemViews[i + 1];
				} else if (i > 0) {
					focus = msgitemViews[i - 1];
				} else {
					focus = null;
				}
			}
		}, "removeSelected");
		const removeUID = /* @__PURE__ */ __name((mailboxID, uid) => {
			const match = /* @__PURE__ */ __name((miv) => miv.messageitem.Message.MailboxID === mailboxID && miv.messageitem.Message.UID === uid, "match");
			const ci = collapsedMsgitemViews.findIndex(match);
			if (ci >= 0) {
				const miv = collapsedMsgitemViews[ci];
				removeCollapsed(ci);
				return miv.messageitem.Message.ThreadID;
			}
			const i = msgitemViews.findIndex(match);
			if (i >= 0) {
				const miv = msgitemViews[i];
				removeExpanded(i);
				return miv.messageitem.Message.ThreadID;
			}
			const ti = oldThreadMessageItems.findIndex((mi) => mi.Message.MailboxID === mailboxID && mi.Message.UID === uid);
			if (ti >= 0) {
				oldThreadMessageItems.splice(ti, 1);
			}
			return 0;
		}, "removeUID");
		const removeCollapsed = /* @__PURE__ */ __name((ci) => {
			const miv = collapsedMsgitemViews[ci];
			collapsedMsgitemViews.splice(ci, 1);
			removeSelected(miv);
			const trmiv = miv.threadRoot();
			const pmiv = miv.parent;
			if (!pmiv) {
				throw new ConsistencyError("removing collapsed miv, but has no parent");
			}
			miv.parent = null;
			const pki = pmiv.kids.indexOf(miv);
			if (pki < 0) {
				throw new ConsistencyError("miv not in parent.kids");
			}
			pmiv.kids.splice(pki, 1, ...miv.kids);
			miv.kids.forEach((kmiv) => kmiv.parent = pmiv);
			miv.kids = [];
			pmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime());
			trmiv.render();
			return;
		}, "removeCollapsed");
		const removeExpanded = /* @__PURE__ */ __name((i) => {
			log("removeExpanded", { i });
			const miv = msgitemViews[i];
			removeSelected(miv);
			const pmiv = miv.parent;
			miv.parent = null;
			if (miv.kids.length === 0) {
				miv.remove();
				msgitemViews.splice(i, 1);
				if (pmiv) {
					const pki2 = pmiv.kids.indexOf(miv);
					if (pki2 < 0) {
						throw new ConsistencyError("miv not in parent.kids");
					}
					pmiv.kids.splice(pki2, 1);
					miv.parent = null;
					pmiv.render();
				}
				return;
			}
			if (!pmiv) {
				const next2 = miv.root.nextSibling;
				miv.remove();
				msgitemViews.splice(i, 1);
				if (miv.collapsed) {
					msgitemViews.splice(i, 0, ...miv.kids);
					for (const kmiv of miv.kids) {
						const pki2 = collapsedMsgitemViews.indexOf(kmiv);
						if (pki2 < 0) {
							throw new ConsistencyError("cannot find collapsed kid in collapsedMsgitemViews");
						}
						collapsedMsgitemViews.splice(pki2, 1);
						kmiv.collapsed = true;
						kmiv.parent = null;
						kmiv.render();
						mlv.root.insertBefore(kmiv.root, next2);
					}
				} else {
					miv.kids.forEach((kmiv) => {
						kmiv.collapsed = false;
						kmiv.parent = null;
						kmiv.render();
						const lastDesc = kmiv.lastDescendant();
						if (lastDesc) {
							lastDesc.render();
						}
					});
				}
				miv.kids = [];
				return;
			}
			const odmivs = pmiv.descendants();
			const pi = msgitemViews.indexOf(pmiv);
			if (pi < 0) {
				throw new ConsistencyError("cannot find parent of removed miv");
			}
			msgitemViews.splice(pi + 1, odmivs.length);
			const pki = pmiv.kids.indexOf(miv);
			if (pki < 0) {
				throw new Error("did not find miv in parent.kids");
			}
			pmiv.kids.splice(pki, 1);
			pmiv.kids.push(...miv.kids);
			miv.kids.forEach((kmiv) => {
				kmiv.parent = pmiv;
			});
			miv.kids = [];
			pmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime());
			const ndmivs = pmiv.descendants();
			if (ndmivs.length !== odmivs.length - 1) {
				throw new ConsistencyError("unexpected new descendants counts during remove");
			}
			msgitemViews.splice(pi + 1, 0, ...ndmivs);
			odmivs.forEach((ndimv) => ndimv.remove());
			const next = pmiv.root.nextSibling;
			for (const ndmiv of ndmivs) {
				mlv.root.insertBefore(ndmiv.root, next);
			}
			pmiv.render();
			ndmivs.forEach((dmiv) => dmiv.render());
		}, "removeExpanded");
		const possiblyTakeoutOldThreads = /* @__PURE__ */ __name((threadIDs) => {
			const hasMatch = /* @__PURE__ */ __name((mivs, threadID) => mivs.find((miv) => miv.messageitem.Message.ThreadID === threadID && miv.messageitem.MatchQuery), "hasMatch");
			const takeoutOldThread = /* @__PURE__ */ __name((mivs, threadID, visible) => {
				let i = 0;
				while (i < mivs.length) {
					const miv = mivs[i];
					const mi = miv.messageitem;
					const m = mi.Message;
					if (threadID !== m.ThreadID) {
						i++;
						continue;
					}
					mivs.splice(i, 1);
					if (visible) {
						miv.remove();
					}
					if (focus === miv) {
						focus = null;
						if (i < mivs.length) {
							focus = mivs[i];
						} else if (i > 0) {
							focus = mivs[i - 1];
						}
					}
					const si = selected.indexOf(miv);
					if (si >= 0) {
						selected.splice(si, 1);
					}
					miv.parent = null;
					miv.kids = [];
					oldThreadMessageItems.push(mi);
					log("took out old thread message", { mi });
				}
			}, "takeoutOldThread");
			for (const threadID of threadIDs) {
				if (hasMatch(msgitemViews, threadID) || hasMatch(collapsedMsgitemViews, threadID)) {
					log("still have query-matching message for thread", { threadID });
					continue;
				}
				takeoutOldThread(msgitemViews, threadID, true);
				takeoutOldThread(collapsedMsgitemViews, threadID, false);
			}
		}, "possiblyTakeoutOldThreads");
		const mlv = {
			root: dom.div(),
			updateFlags: /* @__PURE__ */ __name((mailboxID, uid, modseq, mask, flags, keywords) => {
				const updateMessageFlags = /* @__PURE__ */ __name((m) => {
					m.ModSeq = modseq;
					const maskobj = mask;
					const flagsobj = flags;
					const mobj = m;
					for (const k in maskobj) {
						if (maskobj[k]) {
							mobj[k] = flagsobj[k];
						}
					}
					m.Keywords = keywords;
				}, "updateMessageFlags");
				let miv = msgitemViews.find((miv2) => miv2.messageitem.Message.MailboxID === mailboxID && miv2.messageitem.Message.UID === uid);
				if (!miv) {
					miv = collapsedMsgitemViews.find((miv2) => miv2.messageitem.Message.MailboxID === mailboxID && miv2.messageitem.Message.UID === uid);
				}
				if (miv) {
					updateMessageFlags(miv.messageitem.Message);
					miv.render();
					if (miv.parent) {
						const tr = miv.threadRoot();
						if (tr.collapsed) {
							tr.render();
						}
					}
					if (msgView && msgView.messageitem.Message.ID === miv.messageitem.Message.ID) {
						msgView.updateKeywords(modseq, keywords);
					}
					return;
				}
				const mi = oldThreadMessageItems.find((mi2) => mi2.Message.MailboxID === mailboxID && mi2.Message.UID === uid);
				if (mi) {
					updateMessageFlags(mi.Message);
				} else {
					log("could not find msgitemView for uid", uid);
				}
			}, "updateFlags"),
			// Add messages to view, either messages to fill the view with complete threads, or
			// individual messages delivered later.
			addMessageItems: /* @__PURE__ */ __name((messageItems, isChange, requestMsgID) => {
				if (messageItems.length === 0) {
					return;
				}
				messageItems.forEach((mil) => {
					if (!mil) {
						return;
					}
					const threadID = mil[0].Message.ThreadID;
					const hasMatch = !!mil.find((mi) => mi.MatchQuery);
					if (hasMatch) {
						let i = 0;
						while (i < oldThreadMessageItems.length) {
							const omi = oldThreadMessageItems[i];
							if (omi.Message.ThreadID === threadID) {
								oldThreadMessageItems.splice(i, 1);
								if (!mil.find((mi) => mi.Message.ID === omi.Message.ID)) {
									mil.push(omi);
									log("resurrected old message");
								} else {
									log("dropped old thread message");
								}
							} else {
								i++;
							}
						}
					} else {
						const match = /* @__PURE__ */ __name((miv) => miv.messageitem.Message.ThreadID === threadID, "match");
						if (!msgitemViews.find(match) && !collapsedMsgitemViews.find(match)) {
							log("adding new message(s) to oldTheadMessageItems");
							for (const mi of mil) {
								const ti = oldThreadMessageItems.findIndex((tmi) => tmi.Message.ID === mi.Message.ID);
								if (ti) {
									oldThreadMessageItems[ti] = mi;
								} else {
									oldThreadMessageItems.push(mi);
								}
							}
							return;
						}
					}
					if (isChange) {
						const threadIDs = /* @__PURE__ */ new Set();
						let i = 0;
						while (i < mil.length) {
							const mi = mil[i];
							let miv = msgitemViews.find((miv2) => miv2.messageitem.Message.ID === mi.Message.ID);
							if (!miv) {
								miv = collapsedMsgitemViews.find((miv2) => miv2.messageitem.Message.ID === mi.Message.ID);
							}
							if (miv) {
								miv.messageitem = mi;
								miv.render();
								mil.splice(i, 1);
								miv.threadRoot().render();
								threadIDs.add(mi.Message.ThreadID);
							} else {
								i++;
							}
						}
						log("processed changes for messages with thread", { threadIDs, mil });
						if (mil.length === 0) {
							const oldstate2 = state();
							possiblyTakeoutOldThreads(threadIDs);
							updateState(oldstate2);
							return;
						}
					}
					let receivedTime = mil[0].Message.Received.getTime();
					const tmiv = msgitemViews.find((miv) => miv.messageitem.Message.ThreadID === mil[0].Message.ThreadID);
					if (tmiv) {
						receivedTime = tmiv.receivedTime;
					} else {
						for (const mi of mil) {
							const t = mi.Message.Received.getTime();
							if (settings.orderAsc && t < receivedTime || !settings.orderAsc && t > receivedTime) {
								receivedTime = t;
							}
						}
					}
					const m = /* @__PURE__ */ new Map();
					for (const mi of mil) {
						m.set(mi.Message.ID, newMsgitemView(mi, mlv, otherMailbox, listMailboxes, receivedTime, false));
					}
					let roots = [];
					if (settings.threading === ThreadMode.ThreadOff) {
						roots = [...m.values()];
					} else {
						nextmiv: for (const [_, miv] of m) {
							for (const pid of miv.messageitem.Message.ThreadParentIDs || []) {
								const pmiv = m.get(pid);
								if (pmiv) {
									pmiv.kids.push(miv);
									miv.parent = pmiv;
									continue nextmiv;
								}
							}
							roots.push(miv);
						}
					}
					for (const [_, miv] of m) {
						miv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime());
					}
					if (settings.threading !== ThreadMode.ThreadOff) {
						nextroot: for (let i = 0; i < roots.length; ) {
							const miv = roots[i];
							for (const pid of miv.messageitem.Message.ThreadParentIDs || []) {
								const pi = msgitemViews.findIndex((xmiv) => xmiv.messageitem.Message.ID === pid);
								let parentmiv;
								let collapsed;
								if (pi >= 0) {
									parentmiv = msgitemViews[pi];
									collapsed = parentmiv.collapsed;
									log("found parent", { pi });
								} else {
									parentmiv = collapsedMsgitemViews.find((xmiv) => xmiv.messageitem.Message.ID === pid);
									collapsed = true;
								}
								if (!parentmiv) {
									log("no parentmiv", pid);
									continue;
								}
								const trmiv = parentmiv.threadRoot();
								if (collapsed !== trmiv.collapsed) {
									log("collapsed mismatch", { collapsed, "trmiv.collapsed": trmiv.collapsed, trmiv });
									throw new ConsistencyError("mismatch between msgitemViews/collapsedMsgitemViews and threadroot collapsed");
								}
								let prevLastDesc = null;
								if (!trmiv.collapsed) {
									const ndesc = parentmiv.descendants().length;
									log("removing descendants temporarily", { ndesc });
									prevLastDesc = parentmiv.lastDescendant();
									msgitemViews.splice(pi + 1, ndesc);
								}
								miv.parent = parentmiv;
								parentmiv.kids.push(miv);
								parentmiv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime());
								if (trmiv.collapsed) {
									collapsedMsgitemViews.push(miv, ...miv.descendants());
									miv.render();
									miv.descendants().forEach((miv2) => miv2.render());
									trmiv.render();
								} else {
									const desc = parentmiv.descendants();
									log("inserting parent descendants again", { pi, desc });
									msgitemViews.splice(pi + 1, 0, ...desc);
									const i2 = msgitemViews.indexOf(miv);
									if (i2 < 0) {
										throw new ConsistencyError("cannot find miv just inserted");
									}
									const l = [miv, ...miv.descendants()];
									l.forEach((miv2) => miv2.render());
									const next = i2 + 1 < msgitemViews.length ? msgitemViews[i2 + 1].root : null;
									log("inserting l before next, or appending", { next, l });
									if (next) {
										for (const miv2 of l) {
											log("inserting miv", { root: miv2.root, before: next });
											mlv.root.insertBefore(miv2.root, next);
										}
									} else {
										mlv.root.append(...l.map((e) => e.root));
									}
									msgitemViews[i2 - 1].render();
									if (prevLastDesc) {
										prevLastDesc.render();
									}
								}
								roots.splice(i, 1);
								continue nextroot;
							}
							i++;
						}
					}
					const sign = settings.threading === ThreadMode.ThreadOff && settings.orderAsc ? -1 : 1;
					roots.sort((miva, mivb) => sign * (mivb.messageitem.Message.Received.getTime() - miva.messageitem.Message.Received.getTime()));
					let nextmivindex;
					if (tmiv) {
						nextmivindex = msgitemViews.indexOf(tmiv.threadRoot());
					} else {
						nextmivindex = msgitemViews.findIndex((miv) => !settings.orderAsc && miv.receivedTime <= receivedTime || settings.orderAsc && receivedTime <= miv.receivedTime);
					}
					for (const miv of roots) {
						miv.collapsed = settings.threading === ThreadMode.ThreadOn && miv.messageitem.Message.ThreadCollapsed;
						if (settings.threading === ThreadMode.ThreadUnread) {
							miv.collapsed = miv.messageitem.Message.Seen && !miv.findDescendant((dmiv) => !dmiv.messageitem.Message.Seen);
						}
						if (requestMsgID > 0 && miv.collapsed) {
							miv.collapsed = !miv.findDescendant((dmiv) => dmiv.messageitem.Message.ID === requestMsgID);
						}
						const takeThreadRoot = /* @__PURE__ */ __name((xmiv) => {
							log("taking threadRoot", { id: xmiv.messageitem.Message.ID });
							const xdmiv = xmiv.descendants();
							xdmiv.forEach((xdmiv2) => xdmiv2.remove());
							xmiv.remove();
							miv.kids.push(xmiv);
							xmiv.parent = miv;
							miv.kids.sort((miva, mivb) => miva.messageitem.Message.Received.getTime() - mivb.messageitem.Message.Received.getTime());
							return 1 + xdmiv.length;
						}, "takeThreadRoot");
						if (settings.threading !== ThreadMode.ThreadOff) {
							for (let i = 0; i < msgitemViews.length; ) {
								const xmiv = msgitemViews[i];
								if (!xmiv.parent && xmiv.messageitem.Message.ThreadID === miv.messageitem.Message.ThreadID && (xmiv.messageitem.Message.ThreadParentIDs || []).includes(miv.messageitem.Message.ID)) {
									msgitemViews.splice(i, takeThreadRoot(xmiv));
									nextmivindex = i;
								} else {
									i++;
								}
							}
							for (let i = 0; i < collapsedMsgitemViews.length; ) {
								const xmiv = collapsedMsgitemViews[i];
								if (!xmiv.parent && xmiv.messageitem.Message.ThreadID === miv.messageitem.Message.ThreadID && (xmiv.messageitem.Message.ThreadParentIDs || []).includes(miv.messageitem.Message.ID)) {
									takeThreadRoot(xmiv);
									collapsedMsgitemViews.splice(i, 1);
								} else {
									i++;
								}
							}
						}
						let l = miv.descendants();
						miv.render();
						l.forEach((kmiv) => kmiv.render());
						if (miv.collapsed) {
							collapsedMsgitemViews.push(...l);
							l = [miv];
						} else {
							l = [miv, ...l];
						}
						if (nextmivindex < 0) {
							mlv.root.append(...l.map((miv2) => miv2.root));
							msgitemViews.push(...l);
						} else {
							const next = msgitemViews[nextmivindex].root;
							for (const miv2 of l) {
								mlv.root.insertBefore(miv2.root, next);
							}
							msgitemViews.splice(nextmivindex, 0, ...l);
						}
					}
				});
				if (!isChange) {
					return;
				}
				const oldstate = state();
				if (!focus) {
					focus = msgitemViews[0];
				}
				if (selected.length === 0) {
					if (focus) {
						selected = [focus];
					} else if (msgitemViews.length > 0) {
						selected = [msgitemViews[0]];
					}
				}
				updateState(oldstate);
			}, "addMessageItems"),
			// Remove messages, they can be in different threads.
			removeUIDs: /* @__PURE__ */ __name((mailboxID, uids) => {
				const oldstate = state();
				const hadSelected = selected.length > 0;
				const threadIDs = /* @__PURE__ */ new Set();
				uids.forEach((uid) => {
					const threadID = removeUID(mailboxID, uid);
					log("removed message with thread", { threadID });
					if (threadID) {
						threadIDs.add(threadID);
					}
				});
				possiblyTakeoutOldThreads(threadIDs);
				if (hadSelected && focus && selected.length === 0) {
					selected = [focus];
				}
				updateState(oldstate);
			}, "removeUIDs"),
			// Set new muted/collapsed flags for messages in thread.
			updateMessageThreadFields: /* @__PURE__ */ __name((messageIDs, muted, collapsed) => {
				for (const id of messageIDs) {
					let miv = msgitemViews.find((miv2) => miv2.messageitem.Message.ID === id);
					if (!miv) {
						miv = collapsedMsgitemViews.find((miv2) => miv2.messageitem.Message.ID === id);
					}
					if (miv) {
						miv.messageitem.Message.ThreadMuted = muted;
						miv.messageitem.Message.ThreadCollapsed = collapsed;
						const mivthr = miv.threadRoot();
						if (mivthr.collapsed) {
							mivthr.render();
						} else {
							miv.render();
						}
					} else {
						const mi = oldThreadMessageItems.find((mi2) => mi2.Message.ID === id);
						if (mi) {
							mi.Message.ThreadMuted = muted;
							mi.Message.ThreadCollapsed = collapsed;
						}
					}
				}
			}, "updateMessageThreadFields"),
			// For location hash.
			activeMessageID: /* @__PURE__ */ __name(() => selected.length === 1 ? selected[0].messageitem.Message.ID : 0, "activeMessageID"),
			redraw: /* @__PURE__ */ __name((miv) => {
				miv.root.classList.toggle("focus", miv === focus);
				miv.root.classList.toggle("active", selected.indexOf(miv) >= 0);
			}, "redraw"),
			clear: /* @__PURE__ */ __name(() => {
				dom._kids(mlv.root);
				msgitemViews.forEach((miv) => miv.remove());
				msgitemViews = [];
				collapsedMsgitemViews = [];
				oldThreadMessageItems = [];
				focus = null;
				selected = [];
				dom._kids(msgElem);
				msgView = null;
				setLocationHash();
			}, "clear"),
			unselect: /* @__PURE__ */ __name(() => {
				const oldstate = state();
				selected = [];
				updateState(oldstate);
			}, "unselect"),
			select: /* @__PURE__ */ __name((miv) => {
				const oldstate = state();
				focus = miv;
				selected = [miv];
				updateState(oldstate);
			}, "select"),
			selected: /* @__PURE__ */ __name(() => {
				const l = [];
				for (const miv of selected) {
					l.push(miv);
					if (miv.collapsed) {
						l.push(...miv.descendants());
					}
				}
				return l;
			}, "selected"),
			openMessage: /* @__PURE__ */ __name((parsedMessage) => {
				let miv = msgitemViews.find((miv2) => miv2.messageitem.Message.ID === parsedMessage.ID);
				if (!miv) {
					return false;
				}
				dismissMoveUndoUnless(parsedMessage.ID);
				const oldstate = state();
				focus = miv;
				selected = [miv];
				updateState(oldstate, true, parsedMessage);
				return true;
			}, "openMessage"),
			click: /* @__PURE__ */ __name((miv, ctrl, shift) => {
				if (msgitemViews.length === 0) {
					return;
				}
				if (!(selected.length === 1 && selected[0] === miv)) {
					dismissMoveUndoUnless(miv.messageitem.Message.ID);
				}
				const oldstate = state();
				if (shift) {
					const mivindex = msgitemViews.indexOf(miv);
					let recentindex;
					if (selected.length > 0) {
						let o = selected.length - 1;
						recentindex = msgitemViews.indexOf(selected[o]);
						while (o > 0) {
							if (selected[o - 1] === msgitemViews[recentindex - 1]) {
								recentindex--;
							} else if (selected[o - 1] === msgitemViews[recentindex + 1]) {
								recentindex++;
							} else {
								break;
							}
							o--;
						}
					} else {
						recentindex = mivindex;
					}
					const oselected = selected;
					if (mivindex < recentindex) {
						selected = msgitemViews.slice(mivindex, recentindex + 1);
						selected.reverse();
					} else {
						selected = msgitemViews.slice(recentindex, mivindex + 1);
					}
					if (ctrl) {
						selected = oselected.filter((e) => !selected.includes(e)).concat(selected);
					}
				} else if (ctrl) {
					const index = selected.indexOf(miv);
					if (index < 0) {
						selected.push(miv);
					} else {
						selected.splice(index, 1);
					}
				} else {
					selected = [miv];
				}
				focus = miv;
				updateState(oldstate);
			}, "click"),
			key: /* @__PURE__ */ __name(async (k, e) => {
				const moveKeys = [
					" ",
					"ArrowUp",
					"ArrowDown",
					"PageUp",
					"h",
					"H",
					"PageDown",
					"l",
					"L",
					"j",
					"J",
					"k",
					"K",
					"Home",
					",",
					"<",
					"End",
					".",
					">",
					"n",
					"N",
					"p",
					"P",
					"u",
					"U"
				];
				if (!e.altKey && !e.metaKey && moveKeys.includes(e.key)) {
					const moveclick = /* @__PURE__ */ __name((index, clip) => {
						if (clip && index < 0) {
							index = 0;
						} else if (clip && index >= msgitemViews.length) {
							index = msgitemViews.length - 1;
						}
						if (index < 0 || index >= msgitemViews.length) {
							return;
						}
						if (e.ctrlKey) {
							moveFocus(msgitemViews[index]);
						} else {
							mlv.click(msgitemViews[index], false, e.shiftKey);
						}
					}, "moveclick");
					let i = msgitemViews.findIndex((miv) => miv === focus);
					if (e.key === " ") {
						if (i >= 0) {
							mlv.click(msgitemViews[i], e.ctrlKey, e.shiftKey);
						}
					} else if (e.key === "ArrowUp" || e.key === "k" || e.key === "K") {
						moveclick(i - 1, e.key === "K");
					} else if (e.key === "ArrowDown" || e.key === "j" || e.key === "J") {
						moveclick(i + 1, e.key === "J");
					} else if (e.key === "PageUp" || e.key === "h" || e.key === "H" || e.key === "PageDown" || e.key === "l" || e.key === "L") {
						if (e.key === "l" && e.ctrlKey) {
							return;
						}
						if (msgitemViews.length > 0) {
							let n = Math.max(1, Math.floor(scrollElemHeight() / mlv.itemHeight()) - 1);
							if (e.key === "PageUp" || e.key === "h" || e.key === "H") {
								n = -n;
							}
							moveclick(i + n, true);
						}
					} else if (e.key === "Home" || e.key === "," || e.key === "<") {
						moveclick(0, true);
					} else if (e.key === "End" || e.key === "." || e.key === ">") {
						moveclick(msgitemViews.length - 1, true);
					} else if (e.key === "n" || e.key === "N") {
						if (i < 0) {
							moveclick(0, true);
						} else {
							const tid = msgitemViews[i].messageitem.Message.ThreadID;
							for (; i < msgitemViews.length; i++) {
								if (msgitemViews[i].messageitem.Message.ThreadID !== tid) {
									moveclick(i, true);
									break;
								}
							}
						}
					} else if (e.key === "p" || e.key === "P") {
						if (i < 0) {
							moveclick(0, true);
						} else {
							let thrmiv = msgitemViews[i].threadRoot();
							if (thrmiv === msgitemViews[i]) {
								if (i - 1 >= 0) {
									thrmiv = msgitemViews[i - 1].threadRoot();
								}
							}
							moveclick(msgitemViews.indexOf(thrmiv), true);
						}
					} else if (e.key === "u" || e.key === "U") {
						if (e.key === "u" && e.ctrlKey) {
							return;
						}
						for (i = i < 0 ? 0 : i + 1; i < msgitemViews.length; i += 1) {
							if (!msgitemViews[i].messageitem.Message.Seen || msgitemViews[i].collapsed && msgitemViews[i].findDescendant((miv) => !miv.messageitem.Message.Seen)) {
								moveclick(i, true);
								break;
							}
						}
					}
					e.preventDefault();
					e.stopPropagation();
					return;
				}
				const fn = shortcuts[k];
				if (fn) {
					e.preventDefault();
					e.stopPropagation();
					fn();
				} else if (msgView) {
					msgView.key(k, e);
				} else {
					log("key not handled", k);
				}
			}, "key"),
			mailboxes: /* @__PURE__ */ __name(() => listMailboxes(), "mailboxes"),
			activeMailbox: /* @__PURE__ */ __name(() => activeMailbox(), "activeMailbox"),
			itemHeight: /* @__PURE__ */ __name(() => msgitemViews.length > 0 ? msgitemViews[0].root.getBoundingClientRect().height : 25, "itemHeight"),
			threadExpand: /* @__PURE__ */ __name((miv) => threadExpand(miv, true), "threadExpand"),
			threadCollapse: /* @__PURE__ */ __name((miv) => threadCollapse(miv, true), "threadCollapse"),
			threadToggle,
			viewportEnsureMessages,
			actionBar: listActionBar,
			cmdArchive,
			cmdTrash,
			cmdDelete,
			cmdJunk,
			cmdMarkNotJunk,
			cmdMarkRead,
			cmdMarkUnread,
			cmdMute,
			cmdUnmute
		};
		return mlv;
	}, "newMsglistView");
	var popoverExport = /* @__PURE__ */ __name((reference, mailboxName, messageIDs) => {
		let format;
		let archive;
		let mboxbtn;
		const removeExport = popover(reference, {}, dom.h1(ui("Export")), dom.form(/* @__PURE__ */ __name(function submit() {
			window.setTimeout(() => removeExport(), 100);
		}, "submit"), attr.target("_blank"), attr.method("POST"), attr.action("export"), dom.input(attr.type("hidden"), attr.name("csrf"), attr.value(localStorageGet("webmailcsrftoken") || "")), dom.input(attr.type("hidden"), attr.name("mailbox"), attr.value(mailboxName)), dom.input(attr.type("hidden"), attr.name("messageids"), attr.value((messageIDs || []).join(","))), format = dom.input(attr.type("hidden"), attr.name("format")), archive = dom.input(attr.type("hidden"), attr.name("archive")), dom.div(css("exportFields", { display: "flex", flexDirection: "column", gap: ".5ex" }), mailboxName ? dom.div(dom.label(dom.input(attr.type("checkbox"), attr.name("recursive"), attr.value("on"), /* @__PURE__ */ __name(function change(e) {
			mboxbtn.disabled = e.target.checked;
		}, "change")), ui(" Recursive"))) : [], dom.div(!mailboxName && !messageIDs ? "Mbox " : mboxbtn = dom.submitbutton("Mbox", attr.title(ui("Export as mbox file, not wrapped in an archive.")), /* @__PURE__ */ __name(function click() {
			format.value = "mbox";
			archive.value = "none";
		}, "click")), " ", dom.submitbutton("zip", /* @__PURE__ */ __name(function click() {
			format.value = "mbox";
			archive.value = "zip";
		}, "click")), " ", dom.submitbutton("tgz", /* @__PURE__ */ __name(function click() {
			format.value = "mbox";
			archive.value = "tgz";
		}, "click")), " ", dom.submitbutton("tar", /* @__PURE__ */ __name(function click() {
			format.value = "mbox";
			archive.value = "tar";
		}, "click"))), dom.div(ui("Maildir "), dom.submitbutton("zip", /* @__PURE__ */ __name(function click() {
			format.value = "maildir";
			archive.value = "zip";
		}, "click")), " ", dom.submitbutton("tgz", /* @__PURE__ */ __name(function click() {
			format.value = "maildir";
			archive.value = "tgz";
		}, "click")), " ", dom.submitbutton("tar", /* @__PURE__ */ __name(function click() {
			format.value = "maildir";
			archive.value = "tar";
		}, "click"))))));
	}, "popoverExport");
	var strokePaths = {
		inbox: [
			"M22 12 16 12 14 15 10 15 8 12 2 12",
			"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
		],
		draft: [
			"M12.659 22H18a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v9.34",
			"M14 2v5a1 1 0 0 0 1 1h5",
			"M10.378 12.622a1 1 0 0 1 3 3.003L8.36 20.637a2 2 0 0 1-.854.506l-2.867.837a.5.5 0 0 1-.62-.62l.836-2.869a2 2 0 0 1 .506-.853z"
		],
		sent: [
			"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
			"m21.854 2.147-10.94 10.939"
		],
		trash: [
			"M10 11v6",
			"M14 11v6",
			"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
			"M3 6h18",
			"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
		],
		junk: [
			"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
			"M12 8v4",
			"M12 16h.01"
		],
		archive: [
			"M3 3h18a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z",
			"M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8",
			"M10 12h4"
		],
		folder: [
			"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
		],
		// Hamburger path copied from SSClash sidebar.html.
		menu: ["M4 6h16M4 12h16M4 18h10"],
		compose: [
			"M15.363 17.634a2 2 0 00-.506.854l-.837 2.87a.5.5 0 00.62.62l2.87-.837a2 2 0 00.854-.506l3.013-3.009a1 1 0 10-3.004-3.004z",
			"M22 10.38V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h6.25",
			"m22 7-8.991 5.727a2 2 0 01-2.009 0L2 7"
		],
		// Lucide ellipsis circles (r=1) as stroked paths.
		more: [
			"M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
			"M18 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
			"M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
		],
		back: ["m12 19-7-7 7-7", "M19 12H5"],
		x: ["M18 6 6 18", "m6 6 12 12"],
		flag: ["M6 22V2.8a.8.8 0 0 1 1.17-.71l11.38 5.69a.8.8 0 0 1 0 1.44L6 15.5"],
		plus: ["M5 12h14", "M12 5v14"],
		minus: ["M5 12h14"],
		sun: [
			"M12 2v2",
			"M12 20v2",
			"m4.93 4.93 1.41 1.41",
			"m17.66 17.66 1.41 1.41",
			"M2 12h2",
			"M20 12h2",
			"m6.34 17.66-1.41 1.41",
			"m19.07 4.93-1.41 1.41"
		],
		moon: ["M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"],
		sunMoon: [
			"M12 2v2",
			"M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715",
			"M16 12a4 4 0 0 0-4-4",
			"m19 5-1.256 1.256",
			"M20 12h2"
		],
		languages: [
			"m5 8 6 6",
			"m4 14 6-6 2-3",
			"M2 5h12",
			"M7 2h1",
			"m22 22-5-10-5 10",
			"M14 18h6"
		],
		chevronDown: ["m6 9 6 6 6-6"],
		circleUser: ["M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"],
		user: ["M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"],
		info: ["M12 16v-4", "M12 8h.01"],
		bookOpen: ["M12 5v16", "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"],
		settings: ["M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"],
		logOut: ["m16 17 5-5-5-5", "M21 12H9", "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"],
		check: ["M20 6 9 17l-5-5"]
	};
	var strokeIcon = /* @__PURE__ */ __name((paths, circles, rects) => {
		const ns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(ns, "svg");
		svg.setAttribute("viewBox", "0 0 24 24");
		svg.setAttribute("fill", "none");
		svg.setAttribute("stroke", "currentColor");
		svg.setAttribute("stroke-width", "2");
		svg.setAttribute("stroke-linecap", "round");
		svg.setAttribute("stroke-linejoin", "round");
		svg.setAttribute("width", "18");
		svg.setAttribute("height", "18");
		svg.setAttribute("aria-hidden", "true");
		svg.style.pointerEvents = "none";
		for (const [cx, cy, r] of circles || []) {
			const circle = document.createElementNS(ns, "circle");
			circle.setAttribute("cx", cx);
			circle.setAttribute("cy", cy);
			circle.setAttribute("r", r);
			svg.appendChild(circle);
		}
		for (const rect of rects || []) {
			const el = document.createElementNS(ns, "rect");
			el.setAttribute("x", "" + rect.x);
			el.setAttribute("y", "" + rect.y);
			el.setAttribute("width", "" + rect.width);
			el.setAttribute("height", "" + rect.height);
			el.setAttribute("rx", "" + rect.rx);
			svg.appendChild(el);
		}
		for (const d of paths) {
			const path = document.createElementNS(ns, "path");
			path.setAttribute("d", d);
			svg.appendChild(path);
		}
		return svg;
	}, "strokeIcon");
	var threadCollapseIcon = /* @__PURE__ */ __name(() => {
		const icon = strokeIcon(strokePaths.minus);
		icon.setAttribute("width", "14");
		icon.setAttribute("height", "14");
		return icon;
	}, "threadCollapseIcon");
	var flagMarkIcon = /* @__PURE__ */ __name((on) => {
		const icon = strokeIcon(strokePaths.flag);
		const cloth = icon.querySelector("path");
		if (on && cloth) {
			cloth.setAttribute("fill", "currentColor");
			cloth.setAttribute("class", "msgItemFlagCloth");
		}
		return icon;
	}, "flagMarkIcon");
	var mailboxStrokeIcon = /* @__PURE__ */ __name((mb) => {
		if (mb.Name.split("/")[0] === "Inbox") {
			return strokeIcon(strokePaths.inbox);
		}
		if (mb.Draft) {
			return strokeIcon(strokePaths.draft);
		}
		if (mb.Sent) {
			return strokeIcon(strokePaths.sent);
		}
		if (mb.Trash) {
			return strokeIcon(strokePaths.trash);
		}
		if (mb.Junk) {
			return strokeIcon(strokePaths.junk);
		}
		if (mb.Archive) {
			return strokeIcon(strokePaths.archive);
		}
		if (rejectsMailbox !== "" && mb.Name === rejectsMailbox) {
			return rejects();
		}
		if (introboxMailbox !== "" && mb.Name === introboxMailbox) {
			return introbox();
		}
		return strokeIcon(strokePaths.folder);
	}, "mailboxStrokeIcon");
	var themeGlyph = /* @__PURE__ */ __name((kind) => {
		const svg = kind === "sun" ? strokeIcon(strokePaths.sun, [["12", "12", "4"]]) : kind === "moon" ? strokeIcon(strokePaths.moon) : strokeIcon(strokePaths.sunMoon);
		svg.classList.add("icon");
		return svg;
	}, "themeGlyph");
	var langGlyph = /* @__PURE__ */ __name(() => {
		const svg = strokeIcon(strokePaths.languages);
		svg.classList.add("icon");
		return svg;
	}, "langGlyph");
	var layoutGlyph = /* @__PURE__ */ __name((id) => {
		const frame = { x: 3, y: 3, width: 18, height: 18, rx: 2 };
		let rects = [frame];
		let paths;
		if (id === "leftright") {
			paths = ["M9 3v18"];
		} else if (id === "topbottom") {
			paths = ["M3 9h18"];
		} else {
			rects = [{ x: 2, y: 4, width: 20, height: 16, rx: 2 }];
			paths = ["M12 9v11", "M2 9h13a2 2 0 0 1 2 2v9"];
		}
		const svg = strokeIcon(paths, void 0, rects);
		svg.classList.add("icon");
		return svg;
	}, "layoutGlyph");
	var navIcon = /* @__PURE__ */ __name((paths, circles, extra) => {
		const svg = strokeIcon(paths, circles);
		svg.classList.add("icon");
		if (extra)
			svg.classList.add(extra);
		return svg;
	}, "navIcon");
	var newMailboxView = /* @__PURE__ */ __name((xmb, mailboxlistView, otherMailbox) => {
		const plusbox = "\u229E";
		const minusbox = "\u229F";
		const cmdCollapse = /* @__PURE__ */ __name(async () => {
			settings.mailboxCollapsed[mbv.mailbox.ID] = true;
			settingsPut(settings);
			mailboxlistView.updateHidden();
			mbv.root.focus();
		}, "cmdCollapse");
		const cmdExpand = /* @__PURE__ */ __name(async () => {
			delete settings.mailboxCollapsed[mbv.mailbox.ID];
			settingsPut(settings);
			mailboxlistView.updateHidden();
			mbv.root.focus();
		}, "cmdExpand");
		const collapseElem = dom.span(dom._class("mailboxCollapse"), minusbox, /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			cmdCollapse();
		}, "click"));
		const expandElem = dom.span(plusbox, /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			cmdExpand();
		}, "click"));
		let name, unread, mailboxIcon;
		let actionBtn;
		const cmdOpenActions = /* @__PURE__ */ __name(async () => {
			const trashmb = mailboxlistView.mailboxes().find((mb) => mb.Trash);
			const remove = menuPopover(actionBtn, [
				dom.clickbutton(ui("Mark as read"), attr.title(ui("Mark all messages in the mailbox and its sub mailboxes as read.")), /* @__PURE__ */ __name(async function click() {
					remove();
					const mailboxIDs = [mbv.mailbox.ID, ...mailboxlistView.mailboxes().filter((mb) => mb.Name.startsWith(mbv.mailbox.Name + "/")).map((mb) => mb.ID)];
					await withStatus(ui("Marking mailboxes as read"), client.MailboxesMarkRead(mailboxIDs));
				}, "click")),
				dom.clickbutton(ui("Create mailbox"), attr.title(ui("Create new mailbox within this mailbox.")), /* @__PURE__ */ __name(function click(e) {
					let fieldset;
					let name2;
					const ref = e.target;
					const removeCreate = popover(ref, {}, dom.form(/* @__PURE__ */ __name(async function submit(e2) {
						e2.preventDefault();
						await withStatus(ui("Creating mailbox"), client.MailboxCreate(mbv.mailbox.Name + "/" + name2.value), fieldset);
						removeCreate();
					}, "submit"), fieldset = dom.fieldset(dom.label(ui("Name "), name2 = dom.input(attr.required("yes"))), " ", dom.submitbutton(ui("Create")))));
					remove();
					name2.focus();
				}, "click")),
				dom.clickbutton(ui("Move to trash"), attr.title(ui("Move mailbox, its messages and its mailboxes to the trash.")), /* @__PURE__ */ __name(async function click() {
					if (!trashmb) {
						window.alert(ui("No mailbox configured for trash yet."));
						return;
					}
					if (!window.confirm(ui("Are you sure you want to move this mailbox, its messages and its mailboxes to the trash?"))) {
						return;
					}
					remove();
					await withStatus(ui("Moving mailbox to trash"), client.MailboxRename(mbv.mailbox.ID, trashmb.Name + "/" + mbv.mailbox.Name));
				}, "click")),
				dom.clickbutton(ui("Delete mailbox"), attr.title(ui("Permanently delete this mailbox and all its messages.")), /* @__PURE__ */ __name(async function click() {
					if (!window.confirm(ui("Are you sure you want to permanently delete this mailbox and all its messages?"))) {
						return;
					}
					remove();
					await withStatus(ui("Deleting mailbox"), client.MailboxDelete(mbv.mailbox.ID));
				}, "click")),
				dom.clickbutton(ui("Empty mailbox"), attr.title(ui("Remove all messages from the mailbox, but not mailboxes inside this mailbox or their messages.")), /* @__PURE__ */ __name(async function click() {
					if (!window.confirm(ui("Are you sure you want to empty this mailbox, permanently removing its messages? Mailboxes inside this mailbox are not affected."))) {
						return;
					}
					remove();
					await withStatus(ui("Emptying mailbox"), client.MailboxEmpty(mbv.mailbox.ID));
				}, "click")),
				dom.clickbutton(ui("Rename mailbox"), /* @__PURE__ */ __name(function click() {
					remove();
					let fieldset, name2;
					const remove2 = popover(actionBtn, {}, dom.form(/* @__PURE__ */ __name(async function submit(e) {
						e.preventDefault();
						await withStatus(ui("Renaming mailbox"), client.MailboxRename(mbv.mailbox.ID, name2.value), fieldset);
						remove2();
					}, "submit"), fieldset = dom.fieldset(dom.label(ui("Name "), name2 = dom.input(attr.required(""), attr.value(mbv.mailbox.Name), prop({ selectionStart: 0, selectionEnd: mbv.mailbox.Name.length }))), " ", dom.submitbutton(ui("Rename")))));
					name2.focus();
				}, "click")),
				dom.clickbutton(ui("Set role for mailbox..."), attr.title(ui("Set a special-use role on the mailbox, making it the designated mailbox for either Archived, Sent, Draft, Trashed or Junk messages.")), /* @__PURE__ */ __name(async function click() {
					remove();
					const setUse = /* @__PURE__ */ __name(async (set) => {
						const mb = { ...mbv.mailbox };
						mb.Archive = mb.Draft = mb.Junk = mb.Sent = mb.Trash = false;
						set(mb);
						await withStatus(ui("Marking mailbox as special use"), client.MailboxSetSpecialUse(mb));
					}, "setUse");
					menuPopover(actionBtn, [
						dom.clickbutton(ui("Archive"), /* @__PURE__ */ __name(async function click2() {
							await setUse((mb) => {
								mb.Archive = true;
							});
						}, "click")),
						dom.clickbutton(ui("Draft"), /* @__PURE__ */ __name(async function click2() {
							await setUse((mb) => {
								mb.Draft = true;
							});
						}, "click")),
						dom.clickbutton(ui("Junk"), /* @__PURE__ */ __name(async function click2() {
							await setUse((mb) => {
								mb.Junk = true;
							});
						}, "click")),
						dom.clickbutton(ui("Sent"), /* @__PURE__ */ __name(async function click2() {
							await setUse((mb) => {
								mb.Sent = true;
							});
						}, "click")),
						dom.clickbutton(ui("Trash"), /* @__PURE__ */ __name(async function click2() {
							await setUse((mb) => {
								mb.Trash = true;
							});
						}, "click"))
					]);
				}, "click")),
				dom.clickbutton(ui("Export as..."), /* @__PURE__ */ __name(function click() {
					popoverExport(actionBtn, mbv.mailbox.Name, null);
					remove();
				}, "click"))
			]);
		}, "cmdOpenActions");
		let drags = 0;
		ensureCSS(".mailboxItem.dropping", { background: styles.highlightBackground }, true);
		ensureCSS(".mailboxItem:hover", { backgroundColor: styles.accentSoft, color: styles.color });
		ensureCSS(".mailboxItem.active", { background: styles.accentSoft, color: styles.accent, fontWeight: "600" });
		ensureCSS(".mailboxHoverOnly", { visibility: "hidden" });
		ensureCSS(".mailboxItem:hover .mailboxHoverOnly, .mailboxItem:focus .mailboxHoverOnly", { visibility: "visible" });
		ensureCSS(".mailboxCollapse", { visibility: "hidden" });
		ensureCSS(".mailboxItem:hover .mailboxCollapse, .mailboxItem:focus .mailboxCollapse", { visibility: "visible" });
		const root = dom.div(dom._class("mailboxItem"), attr.tabindex("0"), /* @__PURE__ */ __name(async function keydown(e) {
			if (e.key === "Enter") {
				e.stopPropagation();
				await withStatus(ui("Opening mailbox"), mbv.open(true));
			} else if (e.key === "ArrowLeft") {
				e.stopPropagation();
				if (!mailboxlistView.mailboxLeaf(mbv)) {
					cmdCollapse();
				}
			} else if (e.key === "ArrowRight") {
				e.stopPropagation();
				if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
					cmdExpand();
				}
			} else if (e.key === "b") {
				cmdOpenActions();
			}
		}, "keydown"), /* @__PURE__ */ __name(async function dblclick() {
			if (mailboxlistView.mailboxLeaf(mbv)) {
				return;
			}
			if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
				cmdExpand();
			} else {
				cmdCollapse();
			}
		}, "dblclick"), /* @__PURE__ */ __name(async function click() {
			mbv.root.focus();
			await withStatus(ui("Opening mailbox"), mbv.open(true));
		}, "click"), /* @__PURE__ */ __name(function dragover(e) {
			e.preventDefault();
			e.dataTransfer.dropEffect = "move";
		}, "dragover"), /* @__PURE__ */ __name(function dragenter(e) {
			e.stopPropagation();
			drags++;
			mbv.root.classList.toggle("dropping", true);
		}, "dragenter"), /* @__PURE__ */ __name(function dragleave(e) {
			e.stopPropagation();
			drags--;
			if (drags <= 0) {
				mbv.root.classList.toggle("dropping", false);
			}
		}, "dragleave"), /* @__PURE__ */ __name(async function drop(e) {
			e.preventDefault();
			mbv.root.classList.toggle("dropping", false);
			const sentMailboxID = mailboxlistView.mailboxes().find((mb) => mb.Sent)?.ID;
			const mailboxMsgIDs = JSON.parse(e.dataTransfer.getData("application/vnd.mox.messages"));
			const moved = mailboxMsgIDs.filter((mbMsgID) => mbMsgID[0] !== xmb.ID).filter((mbMsgID) => mailboxMsgIDs.length === 1 || !sentMailboxID || mbMsgID[0] !== sentMailboxID || !otherMailbox(sentMailboxID));
			const msgIDs = moved.map((mbMsgID) => mbMsgID[1]);
			await withStatus(ui("Moving to ") + mailboxLabel(xmb, xmb.Name), client.MessageMove(msgIDs, xmb.ID, false));
			offerMoveUndo(moved.map((mbMsgID) => ({ id: mbMsgID[1], mailboxID: mbMsgID[0] })));
			if (msgIDs.length === 1) {
				const msgID = msgIDs[0];
				const mbSrcID = mailboxMsgIDs.find((mbMsgID) => mbMsgID[1] === msgID)[0];
				await moveAskRuleset(msgID, mbSrcID, xmb, mailboxlistView.mailboxes());
			}
		}, "drop"), dom.div(dom._class("mailbox"), mailboxIcon = dom.span(dom._class("mailboxIcon")), name = dom.div(dom._class("mailboxName")), dom.div(dom._class("mailboxActions"), actionBtn = dom.clickbutton(
			dom._class("mailboxHoverOnly"),
			dom._class("mailboxActionBtn"),
			"\u2026",
			attr.tabindex("-1"),
			// Without, tab breaks because this disappears when mailbox loses focus.
			attr.arialabel(ui("Mailbox actions")),
			attr.title(ui("Actions on mailbox, like deleting, emptying, renaming.")),
			/* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
				cmdOpenActions();
			}, "click")
		), unread = dom.span(dom._class("mailboxUnreadBadge", "isEmpty")))));
		const update = /* @__PURE__ */ __name(() => {
			let moreElems = [];
			if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
				moreElems = [" ", expandElem];
			} else if (!mailboxlistView.mailboxLeaf(mbv)) {
				moreElems = [" ", collapseElem];
			}
			let ntotal = mbv.mailbox.Total;
			let nunread = mbv.mailbox.Unread;
			if (settings.mailboxCollapsed[mbv.mailbox.ID]) {
				const prefix = mbv.mailbox.Name + "/";
				for (const mb of mailboxlistView.mailboxes()) {
					if (mb.Name.startsWith(prefix)) {
						ntotal += mb.Total;
						nunread += mb.Unread;
					}
				}
			}
			dom._kids(mailboxIcon, mailboxStrokeIcon(mbv.mailbox));
			mailboxIcon.style.marginLeft = mbv.parents > 0 ? mbv.parents * 2 / 3 + "em" : "";
			dom._kids(name, dom.span(mailboxLabel(mbv.mailbox, mbv.shortname), attr.title(ui("Total messages: ") + ntotal), moreElems));
			if (nunread === 0) {
				unread.classList.add("isEmpty");
				unread.removeAttribute("title");
				unread.removeAttribute("aria-label");
				dom._kids(unread, []);
			} else {
				unread.classList.remove("isEmpty");
				const label = nunread > 99 ? "99+" : "" + nunread;
				unread.setAttribute("title", unreadTitle(nunread));
				unread.setAttribute("aria-label", unreadTitle(nunread));
				dom._kids(unread, label);
			}
		}, "update");
		const mbv = {
			root,
			// Set by update(), typically through MailboxlistView updateMailboxNames after inserting.
			shortname: "",
			parents: 0,
			hidden: false,
			update,
			mailbox: xmb,
			open: /* @__PURE__ */ __name(async (load) => {
				await mailboxlistView.openMailboxView(mbv, load, false);
			}, "open"),
			setCounts: /* @__PURE__ */ __name((total, unread2) => {
				mbv.mailbox.Total = total;
				mbv.mailbox.Unread = unread2;
				mailboxlistView.updateCounts();
			}, "setCounts"),
			setSpecialUse: /* @__PURE__ */ __name((specialUse) => {
				mbv.mailbox.Archive = specialUse.Archive;
				mbv.mailbox.Draft = specialUse.Draft;
				mbv.mailbox.Junk = specialUse.Junk;
				mbv.mailbox.Sent = specialUse.Sent;
				mbv.mailbox.Trash = specialUse.Trash;
				dom._kids(mailboxIcon, mailboxStrokeIcon(mbv.mailbox));
			}, "setSpecialUse"),
			setKeywords: /* @__PURE__ */ __name((keywords) => {
				mbv.mailbox.Keywords = keywords;
			}, "setKeywords")
		};
		return mbv;
	}, "newMailboxView");
	var newMailboxlistView = /* @__PURE__ */ __name((msglistView, requestNewView, updatePageTitle, setLocationHash, unloadSearch, otherMailbox, onOpenMailbox) => {
		let mailboxViews = [];
		let mailboxViewActive;
		const updateMailboxNames = /* @__PURE__ */ __name(() => {
			const draftmb = mailboxViews.find((mbv) => mbv.mailbox.Draft)?.mailbox;
			const sentmb = mailboxViews.find((mbv) => mbv.mailbox.Sent)?.mailbox;
			const archivemb = mailboxViews.find((mbv) => mbv.mailbox.Archive)?.mailbox;
			const trashmb = mailboxViews.find((mbv) => mbv.mailbox.Trash)?.mailbox;
			const junkmb = mailboxViews.find((mbv) => mbv.mailbox.Junk)?.mailbox;
			const stem = /* @__PURE__ */ __name((s) => s.split("/")[0], "stem");
			const special = [
				(mb) => stem(mb.Name) === "Inbox",
				(mb) => introboxMailbox !== "" && stem(mb.Name) === stem(introboxMailbox),
				// not "specialuse"
				(mb) => draftmb && stem(mb.Name) === stem(draftmb.Name),
				(mb) => sentmb && stem(mb.Name) === stem(sentmb.Name),
				(mb) => archivemb && stem(mb.Name) === stem(archivemb.Name),
				(mb) => trashmb && stem(mb.Name) === stem(trashmb.Name),
				(mb) => junkmb && stem(mb.Name) === stem(junkmb.Name)
			];
			mailboxViews.sort((mbva, mbvb) => {
				const ai = special.findIndex((fn) => fn(mbva.mailbox));
				const bi = special.findIndex((fn) => fn(mbvb.mailbox));
				if (ai < 0 && bi >= 0) {
					return 1;
				} else if (ai >= 0 && bi < 0) {
					return -1;
				} else if (ai >= 0 && bi >= 0 && ai !== bi) {
					return ai < bi ? -1 : 1;
				}
				const la = mbva.mailbox.Name.split("/");
				const lb = mbvb.mailbox.Name.split("/");
				let n = Math.min(la.length, lb.length);
				for (let i = 0; i < n; i++) {
					if (la[i] === lb[i]) {
						continue;
					}
					return la[i] < lb[i] ? -1 : 1;
				}
				return mbva.mailbox.Name < mbvb.mailbox.Name ? -1 : 1;
			});
			let prevmailboxname = "";
			mailboxViews.forEach((mbv) => {
				const mb = mbv.mailbox;
				let shortname = mb.Name;
				let parents = 0;
				if (prevmailboxname) {
					let prefix = "";
					for (const s of prevmailboxname.split("/")) {
						const nprefix = prefix + s + "/";
						if (mb.Name.startsWith(nprefix)) {
							prefix = nprefix;
							parents++;
						} else {
							break;
						}
					}
					shortname = mb.Name.substring(prefix.length);
				}
				mbv.shortname = shortname;
				mbv.parents = parents;
				mbv.update();
				prevmailboxname = mb.Name;
			});
			updateHidden();
		}, "updateMailboxNames");
		const mailboxHidden = /* @__PURE__ */ __name((mb, mailboxesMap) => {
			let s = "";
			for (const e of mb.Name.split("/")) {
				if (s) {
					s += "/";
				}
				s += e;
				const pmb = mailboxesMap[s];
				if (pmb && settings.mailboxCollapsed[pmb.ID] && s !== mb.Name) {
					return true;
				}
			}
			return false;
		}, "mailboxHidden");
		const mailboxLeaf = /* @__PURE__ */ __name((mbv) => {
			const index = mailboxViews.findIndex((v) => v === mbv);
			const prefix = mbv.mailbox.Name + "/";
			const r = index < 0 || index + 1 >= mailboxViews.length || !mailboxViews[index + 1].mailbox.Name.startsWith(prefix);
			return r;
		}, "mailboxLeaf");
		const updateHidden = /* @__PURE__ */ __name(() => {
			const mailboxNameMap = {};
			mailboxViews.forEach((mbv) => mailboxNameMap[mbv.mailbox.Name] = mbv.mailbox);
			for (const mbv of mailboxViews) {
				mbv.hidden = mailboxHidden(mbv.mailbox, mailboxNameMap);
			}
			mailboxViews.forEach((mbv) => mbv.update());
			dom._kids(mailboxesElem, mailboxViews.filter((mbv) => !mbv.hidden));
		}, "updateHidden");
		const root = dom.div();
		const mailboxesElem = dom.div(dom._class("mailboxesList"));
		dom._kids(root, dom.div(dom._class("mailboxesRegion"), attr.role("region"), attr.arialabel(ui("Mailboxes")), dom.div(dom._class("mailboxesHeader"), dom.h1(ui("Mailboxes"), css("mailboxesTitle", { fontSize: ".8rem", textTransform: "uppercase", letterSpacing: ".06em", color: styles.colorMilder, fontWeight: "600", padding: "0 .25em" })), dom.clickbutton(dom._class("btnCompact"), dom._class("mailboxActionBtn"), "\u2026", attr.arialabel(ui("Mailboxes actions")), attr.title(ui("Actions on mailboxes like creating a new mailbox or exporting all email.")), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			const remove = menuPopover(e.target, [
				dom.clickbutton(ui("Create mailbox"), attr.arialabel(ui("Create new mailbox.")), attr.title(ui("Create new mailbox.")), /* @__PURE__ */ __name(function click2(e2) {
					let fieldset;
					let name;
					const ref = e2.target;
					const removeCreate = popover(ref, {}, dom.form(/* @__PURE__ */ __name(async function submit(e3) {
						e3.preventDefault();
						await withStatus(ui("Creating mailbox"), client.MailboxCreate(name.value), fieldset);
						removeCreate();
					}, "submit"), fieldset = dom.fieldset(dom.label(ui("Name "), name = dom.input(attr.required("yes"), focusPlaceholder("Lists/Go/Nuts"))), " ", dom.submitbutton(ui("Create")))));
					remove();
					name.focus();
				}, "click")),
				dom.clickbutton(ui("Export as..."), /* @__PURE__ */ __name(function click2(e2) {
					const ref = e2.target;
					popoverExport(ref, "", null);
					remove();
				}, "click"))
			]);
		}, "click"))), mailboxesElem));
		const loadMailboxes = /* @__PURE__ */ __name((mailboxes, mbnameOpt) => {
			mailboxViews = mailboxes.map((mb) => newMailboxView(mb, mblv, otherMailbox));
			updateMailboxNames();
			if (mbnameOpt) {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.Name === mbnameOpt);
				if (mbv) {
					openMailboxView(mbv, false, false);
				}
			}
		}, "loadMailboxes");
		const closeMailbox = /* @__PURE__ */ __name(() => {
			if (!mailboxViewActive) {
				return;
			}
			mailboxViewActive.root.classList.toggle("active", false);
			mailboxViewActive = null;
			updatePageTitle();
		}, "closeMailbox");
		const openMailboxView = /* @__PURE__ */ __name(async (mbv, load, focus) => {
			unloadSearch();
			if (mailboxViewActive) {
				mailboxViewActive.root.classList.toggle("active", false);
			}
			mailboxViewActive = mbv;
			mbv.root.classList.toggle("active", true);
			updatePageTitle();
			if (load) {
				onOpenMailbox?.();
				setLocationHash();
				const f = newFilter();
				f.MailboxID = mbv.mailbox.ID;
				await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()));
			} else {
				msglistView.clear();
				setLocationHash();
			}
			if (focus) {
				mbv.root.focus();
			}
		}, "openMailboxView");
		const mblv = {
			root,
			loadMailboxes,
			closeMailbox,
			openMailboxView,
			mailboxLeaf,
			updateHidden,
			updateCounts: /* @__PURE__ */ __name(() => mailboxViews.forEach((mbv) => mbv.update()), "updateCounts"),
			activeMailbox: /* @__PURE__ */ __name(() => mailboxViewActive ? mailboxViewActive.mailbox : null, "activeMailbox"),
			mailboxes: /* @__PURE__ */ __name(() => mailboxViews.map((mbv) => mbv.mailbox), "mailboxes"),
			findMailboxByID: /* @__PURE__ */ __name((id) => mailboxViews.find((mbv) => mbv.mailbox.ID === id)?.mailbox || null, "findMailboxByID"),
			findMailboxByName: /* @__PURE__ */ __name((name) => mailboxViews.find((mbv) => mbv.mailbox.Name === name)?.mailbox || null, "findMailboxByName"),
			openMailboxID: /* @__PURE__ */ __name(async (id, focus) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === id);
				if (mbv) {
					await openMailboxView(mbv, false, focus);
				} else {
					throw new Error(ui("unknown mailbox"));
				}
			}, "openMailboxID"),
			addMailbox: /* @__PURE__ */ __name((mb) => {
				const mbv = newMailboxView(mb, mblv, otherMailbox);
				mailboxViews.push(mbv);
				updateMailboxNames();
			}, "addMailbox"),
			renameMailbox: /* @__PURE__ */ __name((mailboxID, newName) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === mailboxID);
				if (!mbv) {
					throw new Error("rename event: unknown mailbox");
				}
				mbv.mailbox.Name = newName;
				updateMailboxNames();
			}, "renameMailbox"),
			removeMailbox: /* @__PURE__ */ __name((mailboxID) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === mailboxID);
				if (!mbv) {
					throw new Error("remove event: unknown mailbox");
				}
				if (mbv === mailboxViewActive) {
					const inboxv = mailboxViews.find((mbv2) => mbv2.mailbox.Name === "Inbox");
					if (inboxv) {
						openMailboxView(inboxv, true, false);
					}
				}
				const index = mailboxViews.findIndex((mbv2) => mbv2.mailbox.ID === mailboxID);
				mailboxViews.splice(index, 1);
				updateMailboxNames();
			}, "removeMailbox"),
			setMailboxCounts: /* @__PURE__ */ __name((mailboxID, total, unread) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === mailboxID);
				if (!mbv) {
					throw new Error("mailbox message/unread count changed: unknown mailbox");
				}
				mbv.setCounts(total, unread);
				if (mbv === mailboxViewActive) {
					updatePageTitle();
				}
			}, "setMailboxCounts"),
			setMailboxSpecialUse: /* @__PURE__ */ __name((mailboxID, specialUse) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === mailboxID);
				if (!mbv) {
					throw new Error("special-use flags changed: unknown mailbox");
				}
				mbv.setSpecialUse(specialUse);
				updateMailboxNames();
			}, "setMailboxSpecialUse"),
			setMailboxKeywords: /* @__PURE__ */ __name((mailboxID, keywords) => {
				const mbv = mailboxViews.find((mbv2) => mbv2.mailbox.ID === mailboxID);
				if (!mbv) {
					throw new Error("keywords changed: unknown mailbox");
				}
				mbv.setKeywords(keywords);
			}, "setMailboxKeywords")
		};
		return mblv;
	}, "newMailboxlistView");
	var newSearchView = /* @__PURE__ */ __name((searchbarElem, mailboxlistView, startSearch, searchViewClose) => {
		let form;
		let words, mailbox, mailboxkids, from, to, oldestDate, oldestTime, newestDate, newestTime, subject, flagViews, labels, minsize, maxsize;
		let attachmentNone, attachmentAny, attachmentImage, attachmentPDF, attachmentArchive, attachmentSpreadsheet, attachmentDocument, attachmentPresentation;
		const makeDateTime = /* @__PURE__ */ __name((dt, tm) => {
			if (!dt && !tm) {
				return "";
			}
			if (!dt) {
				const now = /* @__PURE__ */ new Date();
				const pad0 = /* @__PURE__ */ __name((v) => v <= 9 ? "0" + v : "" + v, "pad0");
				dt = [now.getFullYear(), pad0(now.getMonth() + 1), pad0(now.getDate())].join("-");
			}
			if (dt && tm) {
				return dt + "T" + tm;
			}
			return dt;
		}, "makeDateTime");
		const packString = /* @__PURE__ */ __name((s) => needsDquote(s) ? dquote(s) : s, "packString");
		const packNotString = /* @__PURE__ */ __name((s) => "-" + (needsDquote(s) || s.startsWith("-") ? dquote(s) : s), "packNotString");
		const updateSearchbar = /* @__PURE__ */ __name(() => {
			let tokens = [];
			if (mailbox.value && mailbox.value !== "-1") {
				const v = mailbox.value === "0" ? "" : mailbox.selectedOptions[0].text;
				tokens.push([false, "mb", false, v]);
			}
			if (mailboxkids.checked) {
				tokens.push([false, "submb", false, ""]);
			}
			tokens.push(...parseSearchTokens(words.value));
			tokens.push(...parseSearchTokens(from.value).map((t) => [t[0], "f", false, t[3]]));
			tokens.push(...parseSearchTokens(to.value).map((t) => [t[0], "t", false, t[3]]));
			const start = makeDateTime(oldestDate.value, oldestTime.value);
			if (start) {
				tokens.push([false, "start", false, start]);
			}
			const end = makeDateTime(newestDate.value, newestTime.value);
			if (end) {
				tokens.push([false, "end", false, end]);
			}
			tokens.push(...parseSearchTokens(subject.value).map((t) => [t[0], "s", false, t[3]]));
			const check = /* @__PURE__ */ __name((elem, tag, value) => {
				if (elem.checked) {
					tokens.push([false, tag, false, value]);
				}
			}, "check");
			check(attachmentNone, "a", "none");
			check(attachmentAny, "a", "any");
			check(attachmentImage, "a", "image");
			check(attachmentPDF, "a", "pdf");
			check(attachmentArchive, "a", "archive");
			check(attachmentSpreadsheet, "a", "spreadsheet");
			check(attachmentDocument, "a", "document");
			check(attachmentPresentation, "a", "presentation");
			tokens.push(...flagViews.filter((fv) => fv.active !== null).map((fv) => {
				return [!fv.active, "l", false, fv.flag];
			}));
			tokens.push(...parseSearchTokens(labels.value).map((t) => [t[0], "l", t[2], t[3]]));
			tokens.push(...headerViews.filter((hv) => hv.key.value).map((hv) => [false, "h", false, hv.key.value + ":" + hv.value.value]));
			const minstr = parseSearchSize(minsize.value)[0];
			if (minstr) {
				tokens.push([false, "minsize", false, minstr]);
			}
			const maxstr = parseSearchSize(maxsize.value)[0];
			if (maxstr) {
				tokens.push([false, "maxsize", false, maxstr]);
			}
			searchbarElem.value = tokens.map(packToken).join(" ");
		}, "updateSearchbar");
		const setDateTime = /* @__PURE__ */ __name((s, dateElem, timeElem) => {
			if (!s) {
				return;
			}
			const t = s.split("T", 2);
			const dt = t.length === 2 || t[0].includes("-") ? t[0] : "";
			const tm = t.length === 2 ? t[1] : t[0].includes(":") ? t[0] : "";
			if (dt) {
				dateElem.value = dt;
			}
			if (tm) {
				timeElem.value = tm;
			}
		}, "setDateTime");
		const updateForm = /* @__PURE__ */ __name(() => {
			const [f, notf, strs] = parseSearch(searchbarElem.value, mailboxlistView);
			form.reset();
			const packTwo = /* @__PURE__ */ __name((l, lnot) => (l || []).map(packString).concat((lnot || []).map(packNotString)).join(" "), "packTwo");
			if (f.MailboxName) {
				const o = [...mailbox.options].find((o2) => o2.text === f.MailboxName) || mailbox.options[0];
				if (o) {
					o.selected = true;
				}
			} else if (f.MailboxID === -1) {
				mailbox.options[0].selected = true;
			} else {
				const id = "" + f.MailboxID;
				const o = [...mailbox.options].find((o2) => o2.value === id) || mailbox.options[0];
				o.selected = true;
			}
			mailboxkids.checked = f.MailboxChildrenIncluded;
			words.value = packTwo(f.Words, notf.Words);
			from.value = packTwo(f.From, notf.From);
			to.value = packTwo(f.To, notf.To);
			setDateTime(strs.Oldest, oldestDate, oldestTime);
			setDateTime(strs.Newest, newestDate, newestTime);
			subject.value = packTwo(f.Subject, notf.Subject);
			const elem = {
				none: attachmentNone,
				any: attachmentAny,
				image: attachmentImage,
				pdf: attachmentPDF,
				archive: attachmentArchive,
				spreadsheet: attachmentSpreadsheet,
				document: attachmentDocument,
				presentation: attachmentPresentation
			}[f.Attachments];
			if (elem) {
				attachmentChecks(elem, true);
			}
			const otherlabels = [];
			const othernotlabels = [];
			flagViews.forEach((fv) => fv.active = null);
			const setLabels = /* @__PURE__ */ __name((flabels, other, not) => {
				(flabels || []).forEach((l) => {
					l = l.toLowerCase();
					const fv = flagViews.find((fv2) => fv2.flag.toLowerCase() === l);
					if (fv) {
						fv.active = !not;
						fv.update();
					} else {
						other.push(l);
					}
				});
			}, "setLabels");
			setLabels(f.Labels, otherlabels, false);
			setLabels(notf.Labels, othernotlabels, true);
			labels.value = packTwo(otherlabels, othernotlabels);
			headerViews.slice(1).forEach((hv) => hv.root.remove());
			headerViews = [headerViews[0]];
			if (f.Headers && f.Headers.length > 0) {
				(f.Headers || []).forEach((kv, index) => {
					const [k, v] = kv || ["", ""];
					if (index > 0) {
						addHeaderView();
					}
					headerViews[index].key.value = k;
					headerViews[index].value.value = v;
				});
			}
			if (strs.SizeMin) {
				minsize.value = strs.SizeMin;
			}
			if (strs.SizeMax) {
				maxsize.value = strs.SizeMax;
			}
		}, "updateForm");
		const attachmentChecks = /* @__PURE__ */ __name((elem, set) => {
			if (elem.checked || set) {
				for (const e of [attachmentNone, attachmentAny, attachmentImage, attachmentPDF, attachmentArchive, attachmentSpreadsheet, attachmentDocument, attachmentPresentation]) {
					if (e !== elem) {
						e.checked = false;
					} else if (set) {
						e.checked = true;
					}
				}
			}
		}, "attachmentChecks");
		const changeHandlers = [
			/* @__PURE__ */ __name(function change() {
				updateSearchbar();
			}, "change"),
			/* @__PURE__ */ __name(function keyup() {
				updateSearchbar();
			}, "keyup")
		];
		const attachmentHandlers = [
			/* @__PURE__ */ __name(function change(e) {
				attachmentChecks(e.target);
			}, "change"),
			/* @__PURE__ */ __name(function mousedown(e) {
				const target = e.target;
				if (e.buttons === 1 && target.checked) {
					target.checked = false;
					e.preventDefault();
				}
			}, "mousedown"),
			...changeHandlers
		];
		let headersCell;
		let headerViews;
		const newHeaderView = /* @__PURE__ */ __name((first) => {
			let key, value;
			const root2 = dom.div(dom._class("searchHeaderRow"), key = dom.input(focusPlaceholder(ui("Header name")), changeHandlers), value = dom.input(focusPlaceholder(ui("Header value")), changeHandlers), dom.div(dom._class("searchHeaderActions"), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.plus), attr.arialabel(ui("Add row for another header filter.")), attr.title(ui("Add row for another header filter.")), /* @__PURE__ */ __name(function click() {
				addHeaderView();
			}, "click")), first ? [] : dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.minus), attr.arialabel(ui("Remove row.")), attr.title(ui("Remove row.")), /* @__PURE__ */ __name(function click() {
				root2.remove();
				const index = headerViews.findIndex((v) => v === hv);
				headerViews.splice(index, 1);
				updateSearchbar();
			}, "click"))));
			const hv = { root: root2, key, value };
			return hv;
		}, "newHeaderView");
		const addHeaderView = /* @__PURE__ */ __name(() => {
			const hv = newHeaderView(false);
			headersCell.appendChild(hv.root);
			headerViews.push(hv);
		}, "addHeaderView");
		const setPeriod = /* @__PURE__ */ __name((d) => {
			newestDate.value = "";
			newestTime.value = "";
			const pad0 = /* @__PURE__ */ __name((v) => v <= 9 ? "0" + v : "" + v, "pad0");
			const dt = [d.getFullYear(), pad0(d.getMonth() + 1), pad0(d.getDate())].join("-");
			const tm = "" + pad0(d.getHours()) + ":" + pad0(d.getMinutes());
			oldestDate.value = dt;
			oldestTime.value = tm;
			updateSearchbar();
		}, "setPeriod");
		const searchTableStyle = css("searchTable", { width: "100%", borderCollapse: "collapse" });
		const root = dom.div(dom._class("searchOverlay"), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			searchViewClose();
		}, "click"), /* @__PURE__ */ __name(function keyup(e) {
			if (e.key === "Escape") {
				e.stopPropagation();
				searchViewClose();
			}
		}, "keyup"), form = dom.form(
			dom._class("dialogForm"),
			dom._class("dialogPanel"),
			dom._class("searchContent"),
			/* @__PURE__ */ __name(function click(e) {
				e.stopPropagation();
			}, "click"),
			dom.div(dom._class("dialogHeader"), dom.h1(ui("Search")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close search.")), /* @__PURE__ */ __name(function click() {
				searchViewClose();
			}, "click"))),
			// This is a separate form, inside the form with the overall search field because
			// when updating the form based on the parsed searchbar, we first need to reset it.
			dom.div(dom._class("dialogBody"), dom.table(searchTableStyle, dom.tr(dom.td(dom.label(ui("Mailbox"), attr.for("searchMailbox")), attr.title(ui("Filter by mailbox, including children of the mailbox."))), dom.td(mailbox = dom.select(attr.id("searchMailbox"), style({ width: "100%" }), dom.option(ui("All mailboxes except Trash/Junk/Rejects"), attr.value("-1")), dom.option(ui("All mailboxes"), attr.value("0")), changeHandlers), dom.div(dom._class("searchMailboxKids"), dom.label(mailboxkids = dom.input(attr.type("checkbox"), changeHandlers), ui("Also search in mailboxes below the selected mailbox."))))), dom.tr(dom.td(dom.label(ui("Text"), attr.for("searchWords"))), dom.td(words = dom.input(attr.id("searchWords"), attr.title(ui("Filter by text, case-insensitive, substring match, not necessarily whole words.")), focusPlaceholder('word "exact match" -notword'), style({ width: "100%" }), changeHandlers))), dom.tr(dom.td(dom.label(ui("From"), attr.for("searchFrom"))), dom.td(from = dom.input(attr.id("searchFrom"), style({ width: "100%" }), focusPlaceholder(ui("Address or name")), newAddressComplete(), changeHandlers))), dom.tr(dom.td(dom.label(ui("To"), attr.for("searchTo")), attr.title(ui("Search on addressee, including Cc and Bcc headers."))), dom.td(to = dom.input(attr.id("searchTo"), focusPlaceholder(ui("Address or name, also matches Cc and Bcc addresses")), style({ width: "100%" }), newAddressComplete(), changeHandlers))), dom.tr(dom.td(dom.label(ui("Subject"), attr.for("searchSubject"))), dom.td(subject = dom.input(attr.id("searchSubject"), style({ width: "100%" }), focusPlaceholder(ui('"exact match"')), changeHandlers))), dom.tr(dom.td(ui("Received between"), style({ whiteSpace: "nowrap" })), dom.td(dom.div(dom._class("searchDateRow"), oldestDate = dom.input(attr.type("date"), focusPlaceholder("2023-07-20"), changeHandlers), oldestTime = dom.input(attr.type("time"), focusPlaceholder("23:10"), changeHandlers), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Clear start date.")), attr.title(ui("Clear start date.")), /* @__PURE__ */ __name(function click() {
				oldestDate.value = "";
				oldestTime.value = "";
				updateSearchbar();
			}, "click")), dom.span(ui("and")), newestDate = dom.input(attr.type("date"), focusPlaceholder("2023-07-20"), changeHandlers), newestTime = dom.input(attr.type("time"), focusPlaceholder("23:10"), changeHandlers), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Clear end date.")), attr.title(ui("Clear end date.")), /* @__PURE__ */ __name(function click() {
				newestDate.value = "";
				newestTime.value = "";
				updateSearchbar();
			}, "click"))), dom.div(dom._class("searchDatePresets"), dom.clickbutton(ui("1 day"), /* @__PURE__ */ __name(function click() {
				setPeriod(new Date((/* @__PURE__ */ new Date()).getTime() - 24 * 3600 * 1e3));
			}, "click")), dom.clickbutton(ui("1 week"), /* @__PURE__ */ __name(function click() {
				setPeriod(new Date((/* @__PURE__ */ new Date()).getTime() - 7 * 24 * 3600 * 1e3));
			}, "click")), dom.clickbutton(ui("1 month"), /* @__PURE__ */ __name(function click() {
				setPeriod(new Date((/* @__PURE__ */ new Date()).getTime() - 31 * 24 * 3600 * 1e3));
			}, "click")), dom.clickbutton(ui("1 year"), /* @__PURE__ */ __name(function click() {
				setPeriod(new Date((/* @__PURE__ */ new Date()).getTime() - 365 * 24 * 3600 * 1e3));
			}, "click"))))), dom.tr(dom.td(ui("Attachments")), dom.td(dom.div(dom._class("searchRadios"), dom.label(attachmentNone = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("none"), attachmentHandlers), ui(" None")), dom.label(attachmentAny = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("any"), attachmentHandlers), ui(" Any")), dom.label(attachmentImage = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("image"), attachmentHandlers), ui(" Images")), dom.label(attachmentPDF = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("pdf"), attachmentHandlers), ui(" PDFs")), dom.label(attachmentArchive = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("archive"), attachmentHandlers), ui(" Archives")), dom.label(attachmentSpreadsheet = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("spreadsheet"), attachmentHandlers), ui(" Spreadsheets")), dom.label(attachmentDocument = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("document"), attachmentHandlers), ui(" Documents")), dom.label(attachmentPresentation = dom.input(attr.type("radio"), attr.name("attachments"), attr.value("presentation"), attachmentHandlers), ui(" Presentations"))))), dom.tr(dom.td(ui("Labels")), dom.td(dom.div(dom._class("searchKeywordButtons"), join(flagViews = Object.entries({ Read: "\\Seen", Replied: "\\Answered", Flagged: "\\Flagged", Deleted: "\\Deleted", Draft: "\\Draft", Forwarded: "$Forwarded", Junk: "$Junk", NotJunk: "$NotJunk", Phishing: "$Phishing", MDNSent: "$MDNSent" }).map((t) => {
				const [name, flag2] = t;
				const v = {
					active: null,
					flag: flag2,
					root: dom.clickbutton(ui(name), /* @__PURE__ */ __name(function click() {
						if (v.active === null) {
							v.active = true;
						} else if (v.active === true) {
							v.active = false;
						} else {
							v.active = null;
						}
						v.update();
						updateSearchbar();
					}, "click")),
					update: /* @__PURE__ */ __name(() => {
						css("searchFlagTrue", { backgroundColor: styles.buttonTristateOnBackground }, true);
						css("searchFlagFalse", { backgroundColor: styles.buttonTristateOffBackground }, true);
						v.root.classList.toggle("searchFlagTrue", v.active === true);
						v.root.classList.toggle("searchFlagFalse", v.active === false);
					}, "update")
				};
				return v;
			}), () => " ")), labels = dom.input(focusPlaceholder('todo -done "-dashingname"'), attr.title(ui("User-defined labels.")), changeHandlers))), dom.tr(dom.td(ui("Headers")), headersCell = dom.td(headerViews = [newHeaderView(true)])), dom.tr(dom.td(ui("Size between")), dom.td(dom.div(dom._class("searchSizeRow"), minsize = dom.input(focusPlaceholder("10kb"), changeHandlers), dom.span(ui("and")), maxsize = dom.input(focusPlaceholder("1mb"), changeHandlers)))))),
			dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Cancel"), /* @__PURE__ */ __name(function click(e) {
				e.preventDefault();
				searchViewClose();
			}, "click")), dom.submitbutton(dom._class("btnPrimary"), ui("Search"))),
			/* @__PURE__ */ __name(async function submit2(e) {
				e.preventDefault();
				await searchView.submit();
			}, "submit")
		));
		const submit = /* @__PURE__ */ __name(async () => {
			const [f, notf, _] = parseSearch(searchbarElem.value, mailboxlistView);
			await startSearch(f, notf);
		}, "submit");
		let loaded = false;
		const searchView = {
			root,
			submit,
			ensureLoaded: /* @__PURE__ */ __name(() => {
				if (loaded || mailboxlistView.mailboxes().length === 0) {
					return;
				}
				loaded = true;
				dom._kids(mailbox, dom.option(ui("All mailboxes except Trash/Junk/Rejects"), attr.value("-1")), dom.option(ui("All mailboxes"), attr.value("0")), mailboxlistView.mailboxes().map((mb) => dom.option(mailboxLabel(mb, mb.Name), attr.value("" + mb.ID))));
				searchView.updateForm();
			}, "ensureLoaded"),
			updateForm
		};
		return searchView;
	}, "newSearchView");
	var parseComposeMailto = /* @__PURE__ */ __name((mailto) => {
		const u = new URL(mailto);
		const addresses = /* @__PURE__ */ __name((s) => s.split(",").filter((s2) => !!s2), "addresses");
		const opts = {};
		opts.to = addresses(u.pathname).map((s) => decodeURIComponent(s));
		for (const [xk, v] of new URLSearchParams(u.search)) {
			const k = xk.toLowerCase();
			if (k === "to") {
				opts.to = [...opts.to, ...addresses(v)];
			} else if (k === "cc") {
				opts.cc = [...opts.cc || [], ...addresses(v)];
			} else if (k === "bcc") {
				opts.bcc = [...opts.bcc || [], ...addresses(v)];
			} else if (k === "subject") {
				opts.subject = v;
			} else if (k === "body") {
				opts.body = v;
			}
		}
		return opts;
	}, "parseComposeMailto");
	var init = /* @__PURE__ */ __name(async () => {
		let connectionElem;
		let accountElem;
		let loginAddressElem;
		let accountRoot;
		let accountMenu;
		let accountToggle;
		let splitElem;
		let mailboxesElem;
		let currentLayout = "";
		let msglistscrollElem;
		let queryactivityElem;
		let composeBtn;
		let searchbarElemBox;
		let settingsBtn;
		let mailboxesListMsgBox;
		const listendElem = dom.div(css("msgListEnd", { borderTop: "1px solid", borderColor: styles.borderColor, color: styles.colorMilder, margin: "1ex" }));
		const listloadingElem = dom.div(css("msgListLoading", { textAlign: "center", padding: ".15em 0", color: styles.colorMild, border: "1px solid", borderColor: styles.borderColor, margin: "1ex", backgroundColor: styles.backgroundColorMild }), ui("loading..."));
		const listerrElem = dom.div(css("msgListErr", { textAlign: "center", padding: ".15em 0", color: styles.colorMild, border: "1px solid", borderColor: styles.borderColor, margin: "1ex", backgroundColor: styles.backgroundColorMild }));
		let sseID = 0;
		let viewSequence = 0;
		let viewID = 0;
		let search = {
			active: false,
			// Whether a search is active.
			query: ""
			// The query, as shown in the searchbar. Used in location hash.
		};
		let requestSequence = 0;
		let requestID = 0;
		let requestAnchorMessageID = 0;
		let requestViewEnd = false;
		let requestFilter = newFilter();
		let requestNotFilter = newNotFilter();
		let requestMsgID = 0;
		[moxversion, moxgoos, moxgoarch] = await client.Version();
		const updatePageTitle = /* @__PURE__ */ __name(() => {
			const mb = mailboxlistView && mailboxlistView.activeMailbox();
			const addr = loginAddress ? loginAddress.User + "@" + formatDomain(loginAddress.Domain) : "";
			if (!mb) {
				document.title = [addr, "Mox Webmail"].join(" - ");
			} else {
				document.title = ["(" + mb.Unread + ") " + mailboxLabel(mb, mb.Name), addr, "Mox Webmail"].join(" - ");
			}
		}, "updatePageTitle");
		const faviconLink = document.head.querySelector('link[rel="icon"]');
		const faviconImg = dom.img(attr.src("favicon.png"));
		const faviconProm = new Promise((resolve, reject) => {
			faviconImg.addEventListener("load", () => resolve());
			faviconImg.addEventListener("error", () => reject());
		});
		let faviconState = 0;
		const faviconDraw = /* @__PURE__ */ __name(async () => {
			try {
				await faviconProm;
			} catch (err) {
				return;
			}
			let state;
			if (!eventSource) {
				state = -1;
			} else {
				const inbox = mailboxlistView.findMailboxByName("Inbox");
				state = Math.min(999, inbox?.Unread || 0);
			}
			if (faviconState === state) {
				return;
			}
			const canvas = dom.canvas(prop({ width: faviconImg.naturalWidth, height: faviconImg.naturalHeight }));
			const ctx = canvas.getContext("2d");
			if (!ctx || !faviconLink) {
				return;
			}
			ctx.drawImage(faviconImg, 0, 0);
			if (state < 0) {
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const px = imageData.data;
				for (let i = 0; i < px.length; i += 4) {
					const a = px[i + 3];
					if (a === 0) {
						continue;
					}
					const grey = Math.floor(0.2126 * px[i] + 0.715 * px[i + 1] + 0.0722 * px[i + 2]);
					px[i] = grey;
					px[i + 1] = grey;
					px[i + 2] = grey;
					px[i + 3] = Math.round(a / 2);
				}
				ctx.putImageData(imageData, 0, 0);
			} else if (state > 0) {
				ctx.font = "bold 14px sans-serif";
				const size = ctx.measureText("" + state);
				ctx.beginPath();
				const radius = (size.fontBoundingBoxAscent + size.fontBoundingBoxDescent) / 2;
				const slack = radius / 3;
				const left = Math.min(32 - 2 * radius, 32 - 2 * slack - size.width);
				const bottom = 32;
				const right = 32;
				ctx.arc(right - radius, bottom - radius, radius, 1.5 * Math.PI, 0.5 * Math.PI, false);
				ctx.lineTo(left - radius, bottom);
				ctx.arc(left + radius, bottom - radius, radius, 0.5 * Math.PI, 1.5 * Math.PI, false);
				ctx.lineTo(right + radius, bottom - 2 * radius);
				ctx.fillStyle = "#222";
				ctx.fill();
				ctx.fillStyle = "white";
				ctx.fillText("" + state, (right + left) / 2 - size.width / 2, bottom - size.fontBoundingBoxDescent);
			}
			faviconLink.href = canvas.toDataURL("image/png");
			faviconState = state;
		}, "faviconDraw");
		const setLocationHash = /* @__PURE__ */ __name(() => {
			const msgid = requestMsgID || msglistView.activeMessageID();
			let trail = msgid ? "," + msgid : "";
			if (composeView && composeView.MsgID) {
				trail += ",compose:" + composeView.MsgID;
			}
			let hash;
			const mb = mailboxlistView && mailboxlistView.activeMailbox();
			if (mb) {
				hash = "#" + mb.Name + trail;
			} else if (search.active) {
				hash = "#search " + search.query + trail;
			} else {
				hash = "#";
			}
			const l = window.location;
			const url = l.protocol + "//" + l.host + l.pathname + l.search + hash;
			window.history.replaceState(void 0, "", url);
		}, "setLocationHash");
		const loadSearch = /* @__PURE__ */ __name((q) => {
			search = { active: true, query: q };
			searchbarElem.value = q;
			searchbarElem.classList.toggle("searchbarActive", true);
			searchbarElemBox.style.flexGrow = "4";
		}, "loadSearch");
		const unloadSearch = /* @__PURE__ */ __name(() => {
			searchbarElem.value = "";
			searchbarElem.classList.toggle("searchbarActive", false);
			searchbarElem.style.zIndex = "";
			searchbarElemBox.style.flexGrow = "";
			search = { active: false, query: "" };
			searchView.root.remove();
		}, "unloadSearch");
		const clearList = /* @__PURE__ */ __name(() => {
			msglistView.clear();
			listendElem.remove();
			listloadingElem.remove();
			listerrElem.remove();
		}, "clearList");
		const requestNewView = /* @__PURE__ */ __name(async (clearMsgID, filterOpt, notFilterOpt) => {
			if (!sseID) {
				throw new Error("not connected");
			}
			if (clearMsgID) {
				requestMsgID = 0;
			}
			msglistView.root.classList.toggle("loading", true);
			clearList();
			viewSequence++;
			viewID = viewSequence;
			if (filterOpt) {
				requestFilter = filterOpt;
				requestNotFilter = notFilterOpt || newNotFilter();
			}
			requestAnchorMessageID = 0;
			requestViewEnd = false;
			const bounds = msglistscrollElem.getBoundingClientRect();
			await requestMessages(bounds, requestMsgID);
		}, "requestNewView");
		const requestMessages = /* @__PURE__ */ __name(async (scrollBounds, destMessageID) => {
			const fetchCount = Math.max(50, 3 * Math.ceil(scrollBounds.height / msglistView.itemHeight()));
			const page2 = {
				AnchorMessageID: requestAnchorMessageID,
				Count: fetchCount,
				DestMessageID: destMessageID
			};
			requestSequence++;
			requestID = requestSequence;
			const [f, notf] = refineFilters(requestFilter, requestNotFilter);
			const query = {
				OrderAsc: settings.orderAsc,
				Threading: settings.threading,
				Filter: f,
				NotFilter: notf
			};
			const request = {
				ID: requestID,
				SSEID: sseID,
				ViewID: viewID,
				Cancel: false,
				Query: query,
				Page: page2
			};
			dom._kids(queryactivityElem, ui("loading..."));
			msglistscrollElem.appendChild(listloadingElem);
			await client.Request(request);
		}, "requestMessages");
		let msgElem = dom.div(css("msgElem", { position: "absolute", right: 0, left: 0, top: 0, bottom: 0, backgroundColor: styles.backgroundColorMild, borderLeft: "1px solid", borderLeftColor: styles.borderColor }));
		let mobileMsgTitle;
		let topBarMessageTitle;
		const applyMobileLayoutStyles = /* @__PURE__ */ __name(() => {
			if (!splitElem) {
				return;
			}
			const layoutTop = splitElem.querySelector(".layoutTop");
			const layoutBottom = splitElem.querySelector(".layoutBottom");
			const layoutLeft = splitElem.querySelector(".layoutLeft");
			const layoutRight = splitElem.querySelector(".layoutRight");
			const grabTB = splitElem.querySelector(".listMsgTopBottomGrab");
			const grabLR = splitElem.querySelector(".listMsgLeftRightGrab");
			if (isMobile()) {
				splitElem.style.left = "0";
				splitElem.style.right = "0";
				if (mailboxesElem) {
					mailboxesElem.style.width = "";
				}
				for (const pane of [layoutTop, layoutBottom, layoutLeft, layoutRight]) {
					if (!pane) {
						continue;
					}
					pane.style.top = "0";
					pane.style.bottom = "0";
					pane.style.left = "0";
					pane.style.right = "0";
					pane.style.width = "auto";
					pane.style.height = "auto";
				}
				if (grabTB) {
					grabTB.style.display = "none";
				}
				if (grabLR) {
					grabLR.style.display = "none";
				}
			} else {
				applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth));
				splitElem.style.right = "0";
				if (currentLayout === "topbottom") {
					if (layoutTop) {
						layoutTop.style.top = "0";
						layoutTop.style.left = "0";
						layoutTop.style.right = "0";
						layoutTop.style.bottom = "";
						layoutTop.style.width = "auto";
						layoutTop.style.height = "calc(" + settings.topHeightPct + "% - 1px)";
					}
					if (layoutBottom) {
						layoutBottom.style.bottom = "0";
						layoutBottom.style.left = "0";
						layoutBottom.style.right = "0";
						layoutBottom.style.width = "auto";
						layoutBottom.style.height = "auto";
						layoutBottom.style.top = "calc(" + settings.topHeightPct + "% + 1px)";
					}
					if (grabTB) {
						grabTB.style.display = "";
					}
				} else if (currentLayout === "leftright") {
					if (layoutLeft) {
						layoutLeft.style.top = "0";
						layoutLeft.style.bottom = "0";
						layoutLeft.style.left = "0";
						layoutLeft.style.height = "auto";
						layoutLeft.style.width = "calc(" + settings.leftWidthPct + "% - 1px)";
					}
					if (layoutRight) {
						layoutRight.style.top = "0";
						layoutRight.style.bottom = "0";
						layoutRight.style.right = "0";
						layoutRight.style.height = "auto";
						layoutRight.style.left = "calc(" + settings.leftWidthPct + "% + 1px)";
					}
					if (grabLR) {
						grabLR.style.display = "";
					}
				}
			}
		}, "applyMobileLayoutStyles");
		const setMobilePane = /* @__PURE__ */ __name((pane) => {
			document.documentElement.classList.toggle("mobile-pane-list", isMobile() && pane === "list");
			document.documentElement.classList.toggle("mobile-pane-message", isMobile() && pane === "message");
			applyMobileLayoutStyles();
		}, "setMobilePane");
		const closeMailboxesDrawer = /* @__PURE__ */ __name(() => {
			document.documentElement.classList.remove("mailboxes-drawer-open");
		}, "closeMailboxesDrawer");
		const openMailboxesDrawer = /* @__PURE__ */ __name(() => {
			document.documentElement.classList.add("mailboxes-drawer-open");
		}, "openMailboxesDrawer");
		const onMobileMailboxOpen = /* @__PURE__ */ __name(() => {
			if (!isMobile()) {
				return;
			}
			closeMailboxesDrawer();
			msglistView.unselect();
			setMobilePane("list");
		}, "onMobileMailboxOpen");
		const onMobileMessagePane = /* @__PURE__ */ __name((open) => {
			if (!isMobile()) {
				return;
			}
			setMobilePane(open ? "message" : "list");
			if (open) {
				const mb = mailboxlistView.activeMailbox();
				const subj = msglistView.activeMessageID() ? msglistView.selected()[0]?.messageitem.Envelope.Subject || ui("(no subject)") : "";
				const title = subj || (mb ? mailboxLabel(mb, mb.Name) : ui("Message"));
				mobileMsgTitle.textContent = title;
			}
		}, "onMobileMessagePane");
		const mobileBackToList = /* @__PURE__ */ __name(() => {
			msglistView.unselect();
			setMobilePane("list");
		}, "mobileBackToList");
		const possibleLabels = /* @__PURE__ */ __name(() => {
			if (requestFilter.MailboxID > 0) {
				const mb = mailboxlistView.findMailboxByID(requestFilter.MailboxID);
				if (mb) {
					return mb.Keywords || [];
				}
			}
			const all = {};
			mailboxlistView.mailboxes().forEach((mb) => {
				for (const k of mb.Keywords || []) {
					all[k] = void 0;
				}
			});
			const l = Object.keys(all);
			l.sort();
			return l;
		}, "possibleLabels");
		const refineKeyword = /* @__PURE__ */ __name(async (kw) => {
			settingsPut({ ...settings, refine: "label:" + kw });
			refineToggleActive(refineLabelBtn);
			dom._kids(refineLabelBtn, ui("Label: ") + kw);
			await withStatus(ui("Requesting messages"), requestNewView(false));
		}, "refineKeyword");
		const viewportEnsureMessages = /* @__PURE__ */ __name(async () => {
			const bounds = msglistscrollElem.getBoundingClientRect();
			if (msglistscrollElem.scrollTop < msglistscrollElem.scrollHeight - 3 * bounds.height) {
				return;
			}
			await withStatus(ui("Requesting more messages"), requestMessages(bounds, 0));
		}, "viewportEnsureMessages");
		const otherMailbox = /* @__PURE__ */ __name((mailboxID) => requestFilter.MailboxID !== mailboxID ? mailboxlistView.findMailboxByID(mailboxID) || null : null, "otherMailbox");
		const listMailboxes = /* @__PURE__ */ __name(() => mailboxlistView.mailboxes(), "listMailboxes");
		const activeMailbox = /* @__PURE__ */ __name(() => mailboxlistView.activeMailbox(), "activeMailbox");
		const msglistView = newMsglistView(msgElem, activeMailbox, listMailboxes, setLocationHash, otherMailbox, possibleLabels, () => msglistscrollElem ? msglistscrollElem.getBoundingClientRect().height : 0, refineKeyword, viewportEnsureMessages, onMobileMessagePane);
		const mailboxlistView = newMailboxlistView(msglistView, requestNewView, updatePageTitle, setLocationHash, unloadSearch, otherMailbox, onMobileMailboxOpen);
		let refineUnreadBtn, refineReadBtn, refineAttachmentsBtn, refineFlaggedBtn, refineLabelBtn;
		const refineToggleActive = /* @__PURE__ */ __name((btn) => {
			for (const e of [refineUnreadBtn, refineReadBtn, refineAttachmentsBtn, refineFlaggedBtn, refineLabelBtn]) {
				e.classList.toggle("active", e === btn);
			}
			if (btn !== null && btn !== refineLabelBtn) {
				dom._kids(refineLabelBtn, ui("Label"));
			}
		}, "refineToggleActive");
		const refineToggle = /* @__PURE__ */ __name(async (refine, btn) => {
			if (settings.refine === refine) {
				settingsPut({ ...settings, refine: "" });
				refineToggleActive(null);
			} else {
				settingsPut({ ...settings, refine });
				refineToggleActive(btn);
			}
			dom._kids(refineLabelBtn, settings.refine.startsWith("label:") ? ui("Label: ") + settings.refine.substring("label:".length) : ui("Label"));
			await withStatus(ui("Requesting messages"), requestNewView(false));
		}, "refineToggle");
		let threadMode;
		const msgColumnDraggerStyle = css("msgColumnDragger", { position: "absolute", top: 0, bottom: 0, width: "1px", backgroundColor: styles.popupBorderColor, left: "2.5px" });
		let msglistElem = dom.div(css("msgList", { backgroundColor: styles.msglistBackgroundColor, position: "absolute", left: "0", right: 0, top: 0, bottom: 0, display: "flex", flexDirection: "column" }), dom.div(attr.role("region"), attr.arialabel(ui("Filter and sorting buttons for message list")), css("msgListFilterSorting", { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "6px", minWidth: 0, backgroundColor: styles.backgroundColorMild, borderBottom: "1px solid", borderBottomColor: styles.borderColor, padding: ".35em .5em" }), dom.div(dom._class("refineBar"), dom.span(css("refineTitle", { fontWeight: "normal", fontSize: "inherit" }), ui("Refine:"), attr.title(ui("Refine message listing with quick filters. These refinement filters are in addition to any search criteria, but the refine attachment filter overrides a search attachment criteria."))), dom.span(dom._class("btngroup"), refineUnreadBtn = dom.clickbutton(settings.refine === "unread" ? dom._class("active") : [], ui("Unread"), attr.title(ui("Only show messages marked as unread.")), /* @__PURE__ */ __name(async function click(e) {
			await refineToggle("unread", e.target);
		}, "click")), refineReadBtn = dom.clickbutton(settings.refine === "read" ? dom._class("active") : [], ui("Read"), attr.title(ui("Only show messages marked as read.")), /* @__PURE__ */ __name(async function click(e) {
			await refineToggle("read", e.target);
		}, "click")), refineAttachmentsBtn = dom.clickbutton(settings.refine === "attachments" ? dom._class("active") : [], ui("Attachments"), attr.title(ui("Only show messages with attachments.")), /* @__PURE__ */ __name(async function click(e) {
			await refineToggle("attachments", e.target);
		}, "click")), refineFlaggedBtn = dom.clickbutton(settings.refine === "flagged" ? dom._class("active") : [], ui("Flagged"), attr.title(ui("Only show flagged/starred messages.")), /* @__PURE__ */ __name(async function click(e) {
			await refineToggle("flagged", e.target);
		}, "click")), refineLabelBtn = dom.clickbutton(settings.refine.startsWith("label:") ? [dom._class("active"), ui("Label: ") + settings.refine.substring("label:".length)] : ui("Label"), attr.title(ui("Only show messages with the selected label.")), /* @__PURE__ */ __name(async function click(e) {
			const labels = possibleLabels();
			const remove = menuPopover(e.target, [
				...labels.map((l) => {
					const selectLabel = /* @__PURE__ */ __name(async () => {
						await refineToggle("label:" + l, e.target);
						remove();
					}, "selectLabel");
					return dom.clickbutton(styleClasses.keyword, keywordButtonStyle, l, /* @__PURE__ */ __name(async function click2() {
						await selectLabel();
					}, "click"));
				}),
				labels.length === 0 ? dom.clickbutton(ui("No labels yet"), attr.disabled("")) : []
			]);
		}, "click")), dom.clickbutton("\xD7", attr.arialabel(ui("Clear refinement filters.")), attr.title(ui("Clear refinement filters.")), /* @__PURE__ */ __name(async function click(e) {
			settingsPut({ ...settings, refine: "" });
			refineToggleActive(e.target);
			await withStatus(ui("Requesting messages"), requestNewView(false));
		}, "click"))), dom.div(dom._class("msgListFilterSortingControls"), queryactivityElem = dom.span(), dom.span(dom._class("threadModeLabel"), ui("Threads")), threadMode = dom.select(dom._class("threadModeSelect"), attr.arialabel(ui("Thread modes.")), attr.title(ui("Off: Threading disabled, messages are shown individually.\nOn: Group messages in threads, expanded by default except when (previously) manually collapsed.\nUnread: Only expand thread with unread messages, ignoring and not saving whether they were manually collapsed.")), dom.option(ui("Threads: Off"), attr.value(ThreadMode.ThreadOff), settings.threading === ThreadMode.ThreadOff ? attr.selected("") : []), dom.option(ui("Threads: On"), attr.value(ThreadMode.ThreadOn), settings.threading === ThreadMode.ThreadOn ? attr.selected("") : []), dom.option(ui("Threads: Unread"), attr.value(ThreadMode.ThreadUnread), settings.threading === ThreadMode.ThreadUnread ? attr.selected("") : []), /* @__PURE__ */ __name(async function change() {
			let reset = settings.threading === ThreadMode.ThreadOff;
			settingsPut({ ...settings, threading: threadMode.value });
			reset = reset || settings.threading === ThreadMode.ThreadOff;
			if (reset) {
				await withStatus(ui("Requesting messages"), requestNewView(false));
			} else {
				msglistView.threadToggle();
			}
		}, "change")), dom.clickbutton(dom._class("threadSortBtn"), "\u2191\u2193", attr.title(ui("Toggle sorting by date received.")), settings.orderAsc ? dom._class("invert") : [], /* @__PURE__ */ __name(async function click(e) {
			settingsPut({ ...settings, orderAsc: !settings.orderAsc });
			e.target.classList.toggle("invert", settings.orderAsc);
			await withStatus(ui("Requesting messages"), requestNewView(true));
		}, "click"))))), msglistView.actionBar, dom.div(style({ height: "1ex", position: "relative" }), dom.div(dom._class("msgItemFlags")), dom.div(dom._class("msgItemFlagsOffset"), css("msgItemFlagsGrab", { position: "absolute", width: "6px", top: 0, bottom: 0, marginLeft: "-3px", cursor: "ew-resize" }), dom.div(msgColumnDraggerStyle), /* @__PURE__ */ __name(function mousedown(e) {
			startDrag(e, (e2) => {
				const bounds = msglistscrollElem.getBoundingClientRect();
				const width = Math.round(e2.clientX - bounds.x);
				settingsPut({ ...settings, msglistflagsWidth: width });
				updateMsglistWidths();
			});
		}, "mousedown")), dom.div(dom._class("msgItemMain")), dom.div(dom._class("msgItemMainOffset"), css("msgItemFlagsGrab", { position: "absolute", width: "6px", top: 0, bottom: 0, marginLeft: "-3px", cursor: "ew-resize" }), dom.div(msgColumnDraggerStyle), /* @__PURE__ */ __name(function mousedown(e) {
			startDrag(e, (e2) => {
				const bounds = msglistscrollElem.getBoundingClientRect();
				const width = Math.round(bounds.x + bounds.width - e2.clientX);
				settingsPut({ ...settings, msglistageWidth: width });
				updateMsglistWidths();
			});
		}, "mousedown")), dom.div(dom._class("msgItemAge"))), dom.div(style({ flexGrow: "1", position: "relative" }), msglistscrollElem = dom.div(yscrollStyle, attr.role("region"), attr.arialabel(ui("Message list")), /* @__PURE__ */ __name(async function scroll() {
			if (!sseID || requestViewEnd || requestID) {
				return;
			}
			await viewportEnsureMessages();
		}, "scroll"), dom.div(style({ width: "100%", borderSpacing: "0" }), msglistView))));
		moveUndoHost = msglistElem;
		let searchbarElem;
		const startSearch = /* @__PURE__ */ __name(async (f, notf) => {
			if (!sseID) {
				window.alert(ui("Error: ") + ui("Not connected"));
				return;
			}
			if (f.Attachments !== "" && settings.refine === "attachments") {
				settingsPut({ ...settings, refine: "" });
				refineToggleActive(null);
			}
			search = { active: true, query: searchbarElem.value };
			mailboxlistView.closeMailbox();
			setLocationHash();
			searchbarElem.classList.toggle("searchbarActive", true);
			searchView.root.remove();
			searchbarElem.blur();
			document.body.focus();
			await withStatus(ui("Requesting messages"), requestNewView(true, f, notf));
		}, "startSearch");
		const searchViewClose = /* @__PURE__ */ __name(() => {
			if (!search.active) {
				unloadSearch();
			} else {
				searchbarElem.value = search.query;
				searchView.root.remove();
			}
		}, "searchViewClose");
		let topcomposeboxElem, mailboxessplitElem;
		const searchbarInitial = /* @__PURE__ */ __name(() => {
			const mailboxActive = mailboxlistView.activeMailbox();
			if (mailboxActive && mailboxActive.Name !== "Inbox") {
				return packToken([false, "mb", false, mailboxActive.Name]) + " ";
			}
			return "";
		}, "searchbarInitial");
		const positionSearchView = /* @__PURE__ */ __name(() => {
			const content = searchView.root.querySelector(".searchContent");
			if (!content) {
				return;
			}
			content.style.top = "";
			content.style.left = "";
			content.style.right = "";
			content.style.width = "";
			content.style.transform = "";
		}, "positionSearchView");
		const ensureSearchView = /* @__PURE__ */ __name(() => {
			if (searchView.root.parentElement) {
				positionSearchView();
				return;
			}
			clearMoveUndo();
			searchView.ensureLoaded();
			page.appendChild(searchView.root);
			positionSearchView();
			searchbarElemBox.style.flexGrow = "4";
			searchbarElem.style.zIndex = zindexes.searchbar;
		}, "ensureSearchView");
		const cmdSearch = /* @__PURE__ */ __name(async () => {
			searchbarElem.focus();
			if (!searchbarElem.value) {
				searchbarElem.value = searchbarInitial();
			}
			ensureSearchView();
			searchView.updateForm();
		}, "cmdSearch");
		const cmdCompose = /* @__PURE__ */ __name(async () => {
			let body = "";
			let sig = accountSettings?.Signature || "";
			if (sig) {
				body += "\n\n" + sig;
			}
			compose({ body, editOffset: 0 }, listMailboxes, setLocationHash);
		}, "cmdCompose");
		const cmdOpenInbox = /* @__PURE__ */ __name(async () => {
			const mb = mailboxlistView.findMailboxByName("Inbox");
			if (mb) {
				await mailboxlistView.openMailboxID(mb.ID, true);
				const f = newFilter();
				f.MailboxID = mb.ID;
				await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()));
			}
		}, "cmdOpenInbox");
		const cmdFocusMsg = /* @__PURE__ */ __name(async () => {
			const btn = msgElem.querySelector("button");
			if (btn && btn instanceof HTMLElement) {
				btn.focus();
			}
		}, "cmdFocusMsg");
		const shortcuts = {
			i: cmdOpenInbox,
			"/": cmdSearch,
			"?": cmdHelp,
			"ctrl ?": cmdTooltip,
			c: cmdCompose,
			"ctrl m": cmdFocusMsg,
			"ctrl !": cmdSettings
		};
		let closeAccountMenu = /* @__PURE__ */ __name(() => {
		}, "closeAccountMenu");
		const openAccountMenu = /* @__PURE__ */ __name(() => {
			if (accountRoot.classList.contains("open")) {
				return;
			}
			accountRoot.classList.add("open");
			accountToggle.setAttribute("aria-expanded", "true");
			const onDocClick = /* @__PURE__ */ __name((ev) => {
				const t = ev.target;
				if (t instanceof Node && accountRoot.contains(t)) {
					return;
				}
				closeAccountMenu();
			}, "onDocClick");
			const onDocKey = /* @__PURE__ */ __name((ev) => {
				if (ev.key === "Escape") {
					closeAccountMenu();
				}
			}, "onDocKey");
			document.addEventListener("click", onDocClick);
			document.addEventListener("keydown", onDocKey);
			closeAccountMenu = /* @__PURE__ */ __name(() => {
				accountRoot.classList.remove("open");
				accountToggle.setAttribute("aria-expanded", "false");
				document.removeEventListener("click", onDocClick);
				document.removeEventListener("keydown", onDocKey);
				closeAccountMenu = /* @__PURE__ */ __name(() => {
				}, "closeAccountMenu");
			}, "closeAccountMenu");
		}, "openAccountMenu");
		const accountCmdItem = /* @__PURE__ */ __name((icon, label, title, cmd) => {
			return dom.clickbutton(dom._class("nav-account-item"), attr.role("menuitem"), icon, label, attr.title(title), /* @__PURE__ */ __name(async function click() {
				closeAccountMenu();
				await shortcutCmd(cmd, shortcuts);
			}, "click"));
		}, "accountCmdItem");
		const topBarStyle = css("topBar", { backgroundColor: styles.mailboxesTopBackgroundColor });
		const mailboxesSidebarStyle = css("mailboxesSidebar", { backgroundColor: styles.mailboxesSidebarBackground, borderRight: "1px solid", borderRightColor: styles.borderColor });
		let msgPaneWrap;
		const showMobileOverflow = /* @__PURE__ */ __name((ref) => {
			menuPopover(ref, [
				dom.clickbutton(ui("Tooltip"), clickCmd(cmdTooltip, shortcuts)),
				dom.clickbutton(ui("Help"), clickCmd(cmdHelp, shortcuts)),
				dom.clickbutton(ui("Settings"), clickCmd(cmdSettings, shortcuts)),
				dom.clickbutton(ui("Logout"), /* @__PURE__ */ __name(async function click(ev) {
					await withStatus(ui("Logging out"), client.Logout(), ev.target);
					localStorageRemove("webmailcsrftoken");
					if (eventSource) {
						eventSource.close();
						eventSource = null;
					}
					window.location.reload();
				}, "click"))
			]);
		}, "showMobileOverflow");
		let fitMailboxWidth = /* @__PURE__ */ __name((want) => want, "fitMailboxWidth");
		let applyMailboxColumnWidth = /* @__PURE__ */ __name(() => {
		}, "applyMailboxColumnWidth");
		const layoutModes = [
			{ id: "leftright", label: /* @__PURE__ */ __name(() => ui("Left/right"), "label"), icon: /* @__PURE__ */ __name(() => layoutGlyph("leftright"), "icon") },
			{ id: "topbottom", label: /* @__PURE__ */ __name(() => ui("Top/bottom"), "label"), icon: /* @__PURE__ */ __name(() => layoutGlyph("topbottom"), "icon") },
			{ id: "auto", label: /* @__PURE__ */ __name(() => ui("Auto layout"), "label"), icon: /* @__PURE__ */ __name(() => layoutGlyph("auto"), "icon") }
		];
		const layoutButtons = [];
		const syncLayoutButtons = /* @__PURE__ */ __name(() => {
			for (let i = 0; i < layoutModes.length; i++) {
				const on = settings.layout === layoutModes[i].id;
				layoutButtons[i].classList.toggle("isOn", on);
				layoutButtons[i].setAttribute("aria-pressed", on ? "true" : "false");
			}
		}, "syncLayoutButtons");
		let applyLayoutMode = /* @__PURE__ */ __name(() => {
		}, "applyLayoutMode");
		const layoutRow = dom.div(dom._class("nav-account-layouts"), attr.arialabel(ui("Layout")), ...layoutModes.map((mode) => {
			const on = settings.layout === mode.id;
			const btn = dom.clickbutton(on ? dom._class("nav-layout", "isOn") : dom._class("nav-layout"), mode.icon(), attr.title(mode.label()), attr.arialabel(mode.label()), dom._attrs({ "aria-pressed": on ? "true" : "false" }), /* @__PURE__ */ __name(function click() {
				applyLayoutMode(mode.id);
			}, "click"));
			layoutButtons.push(btn);
			return btn;
		}));
		const webmailroot = dom.div(css("webmailRoot", { display: "flex", flexDirection: "column", alignContent: "stretch", height: "100dvh", position: "relative", zIndex: 0 }), dom.div(topBarStyle, attr.role("region"), attr.arialabel(ui("Top bar")), topcomposeboxElem = dom.div(dom._class("pad"), dom._class("topBarComposeDesktop"), style({ width: settings.mailboxesWidth + "px", textAlign: "center" }), composeBtn = dom.clickbutton(dom._class("btnPrimary"), strokeIcon(strokePaths.compose), ui("Compose"), attr.title(ui("Compose new email message.")), /* @__PURE__ */ __name(function click() {
			shortcutCmd(cmdCompose, shortcuts);
		}, "click"))), dom.div(dom._class("pad"), dom._class("topBarSearchRow"), dom.div(dom._class("topBarMobileOnly"), dom.clickbutton(dom._class("topBarMenuBtn"), attr.title(ui("Open mailboxes.")), attr.arialabel(ui("Open mailboxes.")), /* @__PURE__ */ __name(function click() {
			openMailboxesDrawer();
		}, "click"), dom.span(dom._class("topBarMenuIcon"), strokeIcon(strokePaths.menu)))), dom.div(css("searchbarBox", { paddingLeft: 0, display: "flex", flexGrow: 1, minWidth: 0 }), searchbarElemBox = dom.search(style({ display: "flex", flex: 1, minWidth: 0, width: "100%" }), dom.form(dom._class("topBarSearchForm"), searchbarElem = dom.input(dom._class("topBarSearchInput"), attr.placeholder(ui("Search...")), style({ position: "relative" }), attr.title(ui("Search messages based on criteria like matching free-form text, in a mailbox, labels, addressees.")), focusPlaceholder('word "with space" -notword mb:Inbox f:from@x.example t:rcpt@x.example start:2023-7-1 end:2023-7-8 s:"subject" a:images l:$Forwarded h:Reply-To:other@x.example minsize:500kb'), /* @__PURE__ */ __name(function click() {
			cmdSearch();
			showShortcut("/");
		}, "click"), /* @__PURE__ */ __name(function focus() {
			searchbarElemBox.style.flexGrow = "4";
			if (!searchbarElem.value) {
				searchbarElem.value = searchbarInitial();
			}
		}, "focus"), /* @__PURE__ */ __name(function blur() {
			if (searchbarElem.value === searchbarInitial()) {
				searchbarElem.value = "";
			}
			if (!search.active) {
				searchbarElemBox.style.flexGrow = "";
			}
		}, "blur"), /* @__PURE__ */ __name(function change() {
			searchView.updateForm();
		}, "change"), /* @__PURE__ */ __name(function keyup(e) {
			if (e.key === "Escape") {
				e.stopPropagation();
				searchViewClose();
				return;
			}
			if (searchbarElem.value && searchbarElem.value !== searchbarInitial()) {
				ensureSearchView();
			}
			searchView.updateForm();
		}, "keyup")), dom.clickbutton(dom._class("topBarSearchClear"), strokeIcon(strokePaths.x), attr.arialabel(ui("Cancel and clear search and open Inbox.")), attr.title(ui("Cancel and clear search and open Inbox.")), /* @__PURE__ */ __name(async function click() {
			searchbarElem.value = "";
			if (!search.active) {
				return;
			}
			const mb = mailboxlistView.findMailboxByName("Inbox");
			if (!mb) {
				window.alert(ui("Cannot find inbox."));
				return;
			}
			await mailboxlistView.openMailboxID(mb.ID, true);
			const f = newFilter();
			f.MailboxID = mb.ID;
			await withStatus(ui("Requesting messages"), requestNewView(true, f, newNotFilter()));
		}, "click")), /* @__PURE__ */ __name(async function submit(e) {
			e.preventDefault();
			await searchView.submit();
		}, "submit")))), dom.div(dom._class("topBarMobileOnly"), dom.clickbutton(dom._class("btnPrimary"), dom._class("topBarMobileCompose"), strokeIcon(strokePaths.compose), attr.title(ui("Compose new email message.")), attr.arialabel(ui("Compose")), /* @__PURE__ */ __name(function click() {
			shortcutCmd(cmdCompose, shortcuts);
		}, "click"))), dom.div(dom._class("topBarMobileOnly"), dom.clickbutton(dom._class("topBarMobileOverflow"), strokeIcon(strokePaths.more), attr.title(ui("More actions.")), attr.arialabel(ui("More actions")), /* @__PURE__ */ __name(function click(e) {
			showMobileOverflow(e.target);
		}, "click")))), dom.div(dom._class("pad"), dom._class("topBarMessageRow"), dom.clickbutton(dom._class("topBarMessageBack"), strokeIcon(strokePaths.back), attr.title(ui("Back to message list.")), attr.arialabel(ui("Back to message list.")), /* @__PURE__ */ __name(function click() {
			mobileBackToList();
		}, "click")), topBarMessageTitle = dom.span(dom._class("topBarMessageTitle")), dom.clickbutton(dom._class("topBarMobileOverflow"), strokeIcon(strokePaths.more), attr.title(ui("More actions.")), attr.arialabel(ui("More actions")), /* @__PURE__ */ __name(function click(e) {
			showMobileOverflow(e.target);
		}, "click"))), dom.div(dom._class("pad"), dom._class("topBarStatusRow"), connectionElem = dom.div(), statusElem = dom.div(css("status", { marginLeft: ".5em", flexGrow: "1" }), attr.role("status")), dom.div(dom._class("topBarNav"), dom._class("topBarNavDesktop"), accountRoot = dom.div(dom._class("nav-account"), accountToggle = dom.clickbutton(dom._class("nav-account-toggle"), navIcon(strokePaths.circleUser, [["12", "12", "10"], ["12", "10", "3"]]), loginAddressElem = dom.span(dom._class("nav-account-label")), navIcon(strokePaths.chevronDown, void 0, "nav-account-caret"), attr.arialabel(ui("Account")), dom._attrs({ "aria-haspopup": "menu", "aria-expanded": "false" }), /* @__PURE__ */ __name(function click(e) {
			e.stopPropagation();
			if (accountRoot.classList.contains("open")) {
				closeAccountMenu();
			} else {
				openAccountMenu();
			}
		}, "click")), accountMenu = dom.div(dom._class("nav-account-menu"), accountElem = dom.a(dom._class("nav-account-item"), attr.role("menuitem"), navIcon(strokePaths.user, [["12", "7", "4"]]), ui("Account")), accountCmdItem(navIcon(strokePaths.info, [["12", "12", "10"]]), ui("Tooltip"), ui('Show tooltips, based on the title attributes (underdotted text) for the focused element and all user interface elements below it. Use the keyboard shortcut "ctrl ?" instead of clicking on the tooltip button, which changes focus to the tooltip button.'), cmdTooltip), accountCmdItem(navIcon(strokePaths.bookOpen), ui("Help"), ui("Show popup with basic usage information and a keyboard shortcuts."), cmdHelp), settingsBtn = accountCmdItem(navIcon(strokePaths.settings, [["12", "12", "3"]]), ui("Settings"), ui("Change settings for composing messages."), cmdSettings), dom.div(dom._class("nav-account-divider")), dom.clickbutton(dom._class("nav-account-item"), attr.role("menuitem"), navIcon(strokePaths.logOut), ui("Logout"), attr.title(ui("Logout, invalidating this session.")), /* @__PURE__ */ __name(async function click(e) {
			closeAccountMenu();
			await withStatus(ui("Logging out"), client.Logout(), e.currentTarget);
			localStorageRemove("webmailcsrftoken");
			if (eventSource) {
				eventSource.close();
				eventSource = null;
			}
			window.location.reload();
		}, "click")), dom.div(dom._class("nav-account-divider")), layoutRow)))), dom.div(dom._class("theme-toggle-container"), dom.clickbutton(dom._class("lang-choice"), attr.title(ui("Language")), attr.arialabel(ui("Language")), langGlyph(), /* @__PURE__ */ __name(function click(e) {
			const current = langPreference();
			const item = /* @__PURE__ */ __name((id, label, title) => {
				const on = current === id;
				return dom.clickbutton(label, title ? attr.title(title) : [], on ? dom._attrs({ "aria-current": "true" }) : [], /* @__PURE__ */ __name(function click2() {
					chooseLang(id);
				}, "click"));
			}, "item");
			menuPopover(e.currentTarget, [
				item("auto", ui("Auto"), ui("Follow the browser language")),
				dom.div(dom._class("langRule"), attr.role("separator")),
				item("en", "English"),
				item("ru", "\u0420\u0443\u0441\u0441\u043A\u0438\u0439")
			], true, "langMenu");
		}, "click")), dom.div(dom._class("theme-switch-group"), dom.label(dom._class("theme-toggle"), attr.title(ui("Light or dark theme")), dom.input(attr.type("checkbox"), attr.id("theme-toggle-switch"), attr.arialabel(ui("Dark theme")), /* @__PURE__ */ __name(function change(e) {
			applyTheme(e.target.checked ? "dark" : "light");
		}, "change")), dom.span(dom._class("slider"), dom.span(dom._class("theme-slot", "theme-sun"), themeGlyph("sun")), dom.span(dom._class("theme-slot", "theme-moon"), themeGlyph("moon")))), dom.clickbutton(dom._class("theme-auto"), attr.id("theme-auto"), attr.title(ui("Auto")), attr.arialabel(ui("Auto")), themeGlyph("auto"), /* @__PURE__ */ __name(function click() {
			applyTheme("auto");
		}, "click"))))), mailboxesListMsgBox = dom.div(css("mailboxesListMsgBox", { flexGrow: "1", position: "relative" }), dom.div(dom._class("mailboxesBackdrop"), /* @__PURE__ */ __name(function click() {
			closeMailboxesDrawer();
		}, "click")), mailboxesElem = dom.div(mailboxesSidebarStyle, dom._class("mailboxesSidebar"), style({ width: settings.mailboxesWidth + "px" }), css("mailboxesBox", { display: "flex", flexDirection: "column", alignContent: "stretch", position: "absolute", left: 0, top: 0, bottom: 0, width: "100%", boxSizing: "border-box" }), dom.div(dom._class("pad"), yscrollAutoStyle, style({ flexGrow: "1", position: "relative" }), mailboxlistView.root)), mailboxessplitElem = dom.div(css("mailboxesListGrab", { position: "absolute", width: "5px", top: 0, bottom: 0, cursor: "ew-resize", zIndex: zindexes.splitter }), style({ left: "calc(" + settings.mailboxesWidth + "px - 2px)" }), dom.div(css("mailboxesListLine", { position: "absolute", width: "1px", top: 0, bottom: 0, left: "2px", right: "2px", backgroundColor: styles.popupBorderColor })), /* @__PURE__ */ __name(function mousedown(e) {
			startDrag(e, (e2) => {
				const px = fitMailboxWidth(e2.clientX);
				applyMailboxColumnWidth(px);
				settingsPut({ ...settings, mailboxesWidth: px });
			});
		}, "mousedown")), splitElem = dom.div(css("listMsgBox", { position: "absolute", left: "calc(" + settings.mailboxesWidth + "px + 1px)", right: 0, top: 0, bottom: 0, backgroundColor: styles.backgroundColorMild }))));
		fitMailboxWidth = /* @__PURE__ */ __name((want) => {
			const theme = document.querySelector(".theme-toggle-container")?.getBoundingClientRect().width ?? 0;
			const nav = document.querySelector(".topBarNav")?.getBoundingClientRect().width ?? 0;
			const connection = connectionElem.getBoundingClientRect().width;
			const max = Math.max(160, Math.floor(window.innerWidth - theme - nav - connection - 160 - 48));
			return Math.min(max, Math.max(160, want));
		}, "fitMailboxWidth");
		applyMailboxColumnWidth = /* @__PURE__ */ __name((px) => {
			topcomposeboxElem.style.width = px + "px";
			mailboxesElem.style.width = px + "px";
			mailboxessplitElem.style.left = "calc(" + px + "px - 2px)";
			splitElem.style.left = "calc(" + px + "px + 1px)";
		}, "applyMailboxColumnWidth");
		msgPaneWrap = dom.div(dom._class("mobileMsgPane"), msgElem);
		mobileMsgTitle = topBarMessageTitle;
		const searchView = newSearchView(searchbarElem, mailboxlistView, startSearch, searchViewClose);
		document.body.addEventListener("keydown", async (e) => {
			switch (e.key) {
				case "OS":
				case "Control":
				case "Shift":
				case "Alt":
					return;
			}
			if (popupOpen) {
				return;
			}
			if ((e.target instanceof window.HTMLInputElement || e.target instanceof window.HTMLTextAreaElement || e.target instanceof window.HTMLSelectElement) && !e.ctrlKey && !e.altKey && !e.metaKey) {
				return;
			}
			let l = [];
			if (e.ctrlKey) {
				l.push("ctrl");
			}
			if (e.altKey) {
				l.push("alt");
			}
			if (e.metaKey) {
				l.push("meta");
			}
			if (e.key.length > 1 && e.shiftKey) {
				l.push("shift");
			}
			l.push(e.key);
			const k = l.join(" ");
			if (attachmentView) {
				attachmentView.key(k, e);
				return;
			}
			if (composeView) {
				await composeView.key(k, e);
				return;
			}
			const cmdfn = shortcuts[k];
			if (cmdfn) {
				e.preventDefault();
				e.stopPropagation();
				await cmdfn();
				return;
			}
			msglistView.key(k, e);
		});
		const selectLayout = /* @__PURE__ */ __name((want) => {
			if (want === currentLayout) {
				return;
			}
			if (want === "leftright") {
				let left, split, right;
				dom._kids(splitElem, left = dom.div(css("layoutLeft", { position: "absolute", left: 0, top: 0, bottom: 0 }), style({ width: "calc(" + settings.leftWidthPct + "% - 1px)" }), msglistElem), split = dom.div(css("listMsgLeftRightGrab", { position: "absolute", width: "5px", top: 0, bottom: 0, cursor: "ew-resize", zIndex: zindexes.splitter }), style({ left: "calc(" + settings.leftWidthPct + "% - 2px)" }), dom.div(css("listMsgLeftRightLine", { position: "absolute", backgroundColor: styles.popupBorderColor, top: 0, bottom: 0, width: "1px", left: "2px", right: "2px" })), /* @__PURE__ */ __name(async function mousedown(e) {
					right.style.pointerEvents = "none";
					await startDrag(e, (e2) => {
						const bounds = left.getBoundingClientRect();
						const x = Math.round(e2.clientX - bounds.x);
						left.style.width = "calc(" + x + "px - 1px)";
						split.style.left = "calc(" + x + "px - 2px)";
						right.style.left = "calc(" + x + "px + 1px)";
						settingsPut({ ...settings, leftWidthPct: Math.round(100 * bounds.width / splitElem.getBoundingClientRect().width) });
						updateMsglistWidths();
					});
					right.style.pointerEvents = "";
				}, "mousedown")), right = dom.div(css("layoutRight", { position: "absolute", right: 0, top: 0, bottom: 0 }), style({ left: "calc(" + settings.leftWidthPct + "% + 1px)" }), msgPaneWrap));
			} else {
				let top, split, bottom;
				dom._kids(splitElem, top = dom.div(css("layoutTop", { position: "absolute", top: 0, left: 0, right: 0 }), style({ height: "calc(" + settings.topHeightPct + "% - 1px)" }), msglistElem), split = dom.div(css("listMsgTopBottomGrab", { position: "absolute", height: "5px", left: "0", right: "0", cursor: "ns-resize", zIndex: zindexes.splitter }), style({ top: "calc(" + settings.topHeightPct + "% - 2px)" }), dom.div(css("listmsgTopBottomLine", { position: "absolute", backgroundColor: styles.popupBorderColor, left: 0, right: 0, height: "1px", top: "2px", bottom: "2px" })), /* @__PURE__ */ __name(function mousedown(e) {
					startDrag(e, (e2) => {
						const bounds = top.getBoundingClientRect();
						const y = Math.round(e2.clientY - bounds.y);
						top.style.height = "calc(" + y + "px - 1px)";
						split.style.top = "calc(" + y + "px - 2px)";
						bottom.style.top = "calc(" + y + "px + 1px)";
						settingsPut({ ...settings, topHeightPct: Math.round(100 * bounds.height / splitElem.getBoundingClientRect().height) });
					});
				}, "mousedown")), bottom = dom.div(css("layoutBottom", { position: "absolute", bottom: 0, left: 0, right: 0 }), style({ top: "calc(" + settings.topHeightPct + "% + 1px)" }), msgPaneWrap));
			}
			currentLayout = want;
			checkMsglistWidth();
			applyMobileLayoutStyles();
		}, "selectLayout");
		const autoselectLayout = /* @__PURE__ */ __name(() => {
			const want = window.innerWidth <= 2 * 2560 / 3 ? "topbottom" : "leftright";
			selectLayout(want);
		}, "autoselectLayout");
		applyLayoutMode = /* @__PURE__ */ __name((id) => {
			settingsPut({ ...settings, layout: id });
			if (id === "auto") {
				autoselectLayout();
			} else {
				selectLayout(id);
			}
			syncLayoutButtons();
		}, "applyLayoutMode");
		const styleElem = dom.style(attr.type("text/css"));
		document.head.appendChild(styleElem);
		const stylesheet = styleElem.sheet;
		let lastmsglistwidth = -1;
		const checkMsglistWidth = /* @__PURE__ */ __name(() => {
			const width = msglistscrollElem.getBoundingClientRect().width;
			if (lastmsglistwidth === width || width <= 0) {
				return;
			}
			updateMsglistWidths();
		}, "checkMsglistWidth");
		let rulesInserted = false;
		const measureColumn = /* @__PURE__ */ __name((selector) => {
			let max = 0;
			msglistscrollElem.querySelectorAll(selector).forEach((node) => {
				if (!(node instanceof HTMLElement)) {
					return;
				}
				node.style.width = "max-content";
				node.style.flexBasis = "auto";
				node.style.overflow = "visible";
				const w = Math.ceil(node.getBoundingClientRect().width);
				node.style.width = "";
				node.style.flexBasis = "";
				node.style.overflow = "";
				if (w > max) {
					max = w;
				}
			});
			return max;
		}, "measureColumn");
		const updateMsglistWidths = /* @__PURE__ */ __name(() => {
			const width = msglistscrollElem.clientWidth - 2;
			lastmsglistwidth = width;
			const flagsContent = measureColumn(".msgItemFlags");
			const ageContent = measureColumn(".msgItemAge");
			let flagswidth = isMobile() ? 28 : Math.max(settings.msglistflagsWidth, flagsContent);
			let agewidth = isMobile() ? 58 : Math.max(settings.msglistageWidth, ageContent);
			if (flagswidth + agewidth > width) {
				flagswidth = Math.floor(width / 2);
				agewidth = width - flagswidth;
			}
			const mainwidth = width - (flagswidth + agewidth);
			const cssRules2 = [
				[".msgItemFlags", { width: flagswidth, "flex-grow": 0, "flex-shrink": 0, "flex-basis": flagswidth }],
				[".msgItemMain", { width: mainwidth, "flex-grow": 1, "flex-shrink": 1, "flex-basis": mainwidth, position: "relative", "min-width": 0, "max-width": mainwidth }],
				[".msgItemAge", { width: agewidth, "flex-grow": 0, "flex-shrink": 0, "flex-basis": agewidth, "text-align": "right" }],
				[".msgItemFlagsOffset", { left: flagswidth }],
				[".msgItemMainOffset", { left: flagswidth + mainwidth }]
			];
			if (!rulesInserted) {
				cssRules2.forEach((rule, i) => {
					stylesheet.insertRule(rule[0] + "{}", i);
				});
				rulesInserted = true;
			}
			cssRules2.forEach((rule, i) => {
				const r = stylesheet.cssRules[i];
				for (const k in rule[1]) {
					let v = rule[1][k];
					if (typeof v !== "string") {
						v = "" + v + "px";
					}
					r.style.setProperty(k, v);
				}
			});
		}, "updateMsglistWidths");
		if (isMobile()) {
			selectLayout("topbottom");
		} else if (settings.layout === "auto") {
			autoselectLayout();
		} else {
			selectLayout(settings.layout);
		}
		accountElem.hidden = true;
		accountToggle.setAttribute("aria-haspopup", "menu");
		accountToggle.setAttribute("aria-expanded", "false");
		accountToggle.setAttribute("aria-label", ui("Account"));
		accountMenu.setAttribute("role", "menu");
		document.body.appendChild(webmailroot);
		applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth));
		webmailroot.remove();
		if (window.moxBeforeDisplay) {
			moxBeforeDisplay(webmailroot);
		}
		dom._kids(page, webmailroot);
		applyTheme(themePreference());
		updateMobileMode();
		if (isMobile()) {
			applyMobileLayoutStyles();
			setMobilePane("list");
		}
		checkMsglistWidth();
		let columnSync = 0;
		const scheduleColumnSync = /* @__PURE__ */ __name(() => {
			if (columnSync) {
				return;
			}
			columnSync = requestAnimationFrame(() => {
				columnSync = 0;
				lastmsglistwidth = -1;
				checkMsglistWidth();
			});
		}, "scheduleColumnSync");
		new MutationObserver(scheduleColumnSync).observe(msglistscrollElem, { childList: true, subtree: true });
		let lastViewportWidth = -1;
		const syncViewportMode = /* @__PURE__ */ __name(() => {
			const width = viewportWidth();
			if (width === lastViewportWidth) {
				return;
			}
			lastViewportWidth = width;
			const wasMobile = document.documentElement.classList.contains("mobile");
			updateMobileMode();
			const nowMobile = isMobile();
			if (nowMobile) {
				if (currentLayout !== "topbottom") {
					selectLayout("topbottom");
				}
				applyMobileLayoutStyles();
				if (!wasMobile) {
					setMobilePane(msglistView.activeMessageID() ? "message" : "list");
				}
			} else if (wasMobile) {
				document.documentElement.classList.remove("mobile-pane-list", "mobile-pane-message", "mailboxes-drawer-open");
				if (settings.layout === "auto") {
					autoselectLayout();
				} else {
					selectLayout(settings.layout);
				}
				applyMobileLayoutStyles();
			} else {
				applyMobileLayoutStyles();
				if (settings.layout === "auto") {
					autoselectLayout();
				}
			}
			checkMsglistWidth();
			if (searchView.root.parentElement) {
				positionSearchView();
			}
		}, "syncViewportMode");
		window.addEventListener("resize", syncViewportMode);
		new ResizeObserver(syncViewportMode).observe(document.documentElement);
		window.addEventListener("hashchange", async (e) => {
			const hash = decodeURIComponent(window.location.hash);
			if (hash.startsWith("#compose ")) {
				try {
					const opts = parseComposeMailto(hash.substring("#compose ".length));
					if (e.oldURL) {
						const ou = new URL(e.oldURL);
						window.location.hash = ou.hash;
					} else {
						window.location.hash = "";
					}
					(async () => {
						if (opts.subject && opts.subject.includes("=?")) {
							opts.subject = await withStatus(ui("Decoding MIME words for subject"), client.DecodeMIMEWords(opts.subject));
						}
						compose(opts, listMailboxes, setLocationHash);
					})();
				} catch (err) {
					window.alert(ui("Error parsing compose mailto URL: ") + errmsg(err));
					window.location.hash = "";
				}
				return;
			}
			const [search2, msgid, editMsgid, f, notf] = parseLocationHash(mailboxlistView);
			requestMsgID = msgid;
			if (search2) {
				mailboxlistView.closeMailbox();
				loadSearch(search2);
			} else {
				unloadSearch();
				await mailboxlistView.openMailboxID(f.MailboxID, false);
			}
			if (editMsgid) {
				(async () => {
					try {
						const [mi, pm] = await withStatus(ui("Loading compose message"), Promise.all([client.MessageItem(editMsgid), client.ParsedMessage(editMsgid)]));
						await composeDraft(mi, pm, listMailboxes, setLocationHash);
					} catch (err) {
						window.alert(ui("Error opening draft message: ") + errmsg(err));
					}
				})();
			}
			await withStatus(ui("Requesting messages"), requestNewView(false, f, notf));
		});
		let eventSource = null;
		let connecting = false;
		let autoReconnect = 1;
		let autoReconnectResetTimer = 0;
		let shutdownReconnectTimer = 0;
		let leaving = false;
		window.addEventListener("beforeunload", (e) => {
			if (composeView && composeView.unsavedChanges()) {
				e.preventDefault();
			} else {
				leaving = true;
				if (eventSource) {
					eventSource.close();
					eventSource = null;
					sseID = 0;
				}
			}
		});
		window.addEventListener("pageshow", async (e) => {
			if (e.persisted && !eventSource && !connecting) {
				autoReconnect = 1;
				connect(false);
			}
		});
		window.addEventListener("focus", () => {
			if (!eventSource && !connecting && autoReconnect >= 0) {
				autoReconnect = 0;
				connect(true);
			}
		});
		const showNotConnected = /* @__PURE__ */ __name(() => {
			dom._kids(connectionElem, attr.role("status"), dom.span(css("connectionStatus", { backgroundColor: styles.warningBackgroundColor, padding: "2px 8px", borderRadius: styles.radius, fontSize: "12px" }), ui("Not connected"), attr.title(ui("Not receiving real-time updates, including of new deliveries."))), " ", dom.clickbutton(ui("Reconnect"), /* @__PURE__ */ __name(function click() {
				if (!eventSource && !connecting) {
					autoReconnect = 1;
					connect(true);
				}
			}, "click")));
		}, "showNotConnected");
		const capitalizeFirst = /* @__PURE__ */ __name((s) => s.charAt(0).toUpperCase() + s.slice(1), "capitalizeFirst");
		let openComposeOptions;
		let connectOpenComposeMessageID = 0;
		const uiConnectionStatus = /* @__PURE__ */ __name((connected) => {
			faviconDraw();
			composeBtn.disabled = !connected;
			settingsBtn.disabled = !connected;
			const toggle = /* @__PURE__ */ __name((e) => {
				e.style.opacity = connected ? "" : ".3";
				e.style.pointerEvents = connected ? "" : "none";
				e.toggleAttribute("inert", !connected);
			}, "toggle");
			toggle(searchbarElemBox);
			toggle(mailboxesListMsgBox);
		}, "uiConnectionStatus");
		uiConnectionStatus(false);
		const connect = /* @__PURE__ */ __name(async (isreconnect) => {
			if (shutdownReconnectTimer) {
				window.clearTimeout(shutdownReconnectTimer);
				shutdownReconnectTimer = 0;
			}
			connectionElem.classList.toggle("loading", true);
			dom._kids(connectionElem);
			connectionElem.classList.toggle("loading", false);
			autoReconnect = isreconnect ? 0 : 1;
			connecting = true;
			let token;
			try {
				token = await withStatus(ui("Fetching token for connection with real-time updates"), client.Token(), void 0, true);
			} catch (err) {
				connecting = false;
				autoReconnect = 0;
				dom._kids(statusElem, capitalizeFirst(err.message || ui("Error fetching connection token")) + ui(", not automatically retrying. "));
				showNotConnected();
				return;
			}
			const h = decodeURIComponent(window.location.hash);
			if (h.startsWith("#compose ")) {
				try {
					openComposeOptions = parseComposeMailto(h.substring("#compose ".length));
				} catch (err) {
					window.alert(ui("Error parsing mailto URL: ") + errmsg(err));
				}
				window.location.hash = "";
			}
			let [searchQuery, msgid, editMsgid, f, notf] = parseLocationHash(mailboxlistView);
			if (editMsgid && !composeView) {
				connectOpenComposeMessageID = editMsgid;
			}
			requestMsgID = msgid;
			requestFilter = f;
			requestNotFilter = notf;
			if (searchQuery) {
				loadSearch(searchQuery);
			}
			[f, notf] = refineFilters(requestFilter, requestNotFilter);
			const fetchCount = Math.max(50, 3 * Math.ceil(msglistscrollElem.getBoundingClientRect().height / msglistView.itemHeight()));
			const query = {
				OrderAsc: settings.orderAsc,
				Threading: settings.threading,
				Filter: f,
				NotFilter: notf
			};
			const page2 = {
				AnchorMessageID: 0,
				Count: fetchCount,
				DestMessageID: msgid
			};
			viewSequence++;
			viewID = viewSequence;
			requestSequence++;
			requestID = requestSequence;
			requestAnchorMessageID = 0;
			requestViewEnd = false;
			clearList();
			const request = {
				ID: requestID,
				// A new SSEID is created by the server, sent in the initial response message.
				ViewID: viewID,
				Query: query,
				Page: page2
			};
			let slow = "";
			try {
				const debug = JSON.parse(localStorage.getItem("sherpats-debug") || "null");
				if (debug && debug.waitMinMsec && debug.waitMaxMsec) {
					slow = "&waitMinMsec=" + debug.waitMinMsec + "&waitMaxMsec=" + debug.waitMaxMsec;
				}
			} catch (err) {
			}
			eventSource = new window.EventSource("events?singleUseToken=" + encodeURIComponent(token) + "&request=" + encodeURIComponent(JSON.stringify(request)) + slow);
			let eventID = window.setTimeout(() => dom._kids(statusElem, ui("Connecting... ")), 1e3);
			eventSource.addEventListener("open", (e) => {
				log("eventsource open", { e });
				if (eventID) {
					window.clearTimeout(eventID);
					eventID = 0;
				}
				dom._kids(statusElem);
				dom._kids(connectionElem);
			});
			const sseError = /* @__PURE__ */ __name((errmsg2, addNotRetrying) => {
				uiConnectionStatus(false);
				sseID = 0;
				eventSource.close();
				eventSource = null;
				connecting = false;
				if (autoReconnectResetTimer) {
					clearTimeout(autoReconnectResetTimer);
					autoReconnectResetTimer = 0;
				}
				if (leaving) {
					return;
				}
				if (eventID) {
					window.clearTimeout(eventID);
					eventID = 0;
				}
				document.title = [ui("(not connected)"), loginAddress ? loginAddress.User + "@" + formatDomain(loginAddress.Domain) : "", "Mox Webmail"].filter((s) => s).join(" - ");
				dom._kids(connectionElem);
				if (autoReconnect < 1) {
					let msg = capitalizeFirst(errmsg2);
					if (addNotRetrying) {
						msg += ui(", not automatically retrying. ");
					}
					dom._kids(statusElem, msg);
					showNotConnected();
					listloadingElem.remove();
					listendElem.remove();
				} else {
					connect(true);
				}
			}, "sseError");
			eventSource.addEventListener("error", (e) => {
				log("eventsource error", { e }, JSON.stringify(e));
				sseError(ui("Connection failed"), true);
			});
			eventSource.addEventListener("fatalErr", (e) => {
				const errmsg2 = JSON.parse(e.data) || ui("(no error message)");
				sseError(ui('Server error: "') + errmsg2 + '"', true);
			});
			eventSource.addEventListener("serverShutdown", (_) => {
				autoReconnect = 0;
				sseError(ui("Server shutting down, will try to reconnect in a few seconds"), false);
				shutdownReconnectTimer = window.setTimeout(() => {
					connect(true);
				}, 3e3 + Math.floor(Math.random() * 5e3));
			});
			const checkParse = /* @__PURE__ */ __name((fn) => {
				try {
					return fn();
				} catch (err) {
					const errmsg2 = ui("invalid event from server: ") + (err.message || ui("(no message)"));
					window.alert(errmsg2);
					autoReconnect = -1;
					sseError(errmsg2, true);
					throw err;
				}
			}, "checkParse");
			eventSource.addEventListener("start", (e) => {
				const data = JSON.parse(e.data);
				if (lastServerVersion && data.Version !== lastServerVersion) {
					let reload = true;
					if (composeView && composeView.unsavedChanges()) {
						try {
							withStatus(ui("Saving before reloading due to server update"), composeView.save());
						} catch (err) {
							window.alert(ui("Server was updated, and webmail wants to reload to get the latest changes, but encountered an error while saving changes your open draft message. Please reload at your earliest convenience."));
							reload = false;
						}
					}
					if (reload) {
						const u = URL.parse(window.location.href);
						u.search = "?v=" + data.Version + (u.search ? "&" + u.search.substring(1) : "");
						window.location.href = u.toString();
						return;
					}
				}
				lastServerVersion = data.Version;
				const start = checkParse(() => parser.EventStart(data));
				log("event start", start);
				accountSettings = start.Settings;
				introboxMailbox = start.Introbox;
				connecting = false;
				sseID = start.SSEID;
				loginAddress = start.LoginAddress;
				if (start.AccountPath) {
					accountElem.setAttribute("href", start.AccountPath);
					accountElem.hidden = false;
				} else {
					accountElem.hidden = true;
				}
				const loginAddr = formatEmail(loginAddress);
				dom._kids(loginAddressElem, loginAddr);
				accountToggle.title = loginAddr;
				if (!isMobile()) {
					applyMailboxColumnWidth(fitMailboxWidth(settings.mailboxesWidth));
				}
				accountAddresses = start.Addresses || [];
				accountAddresses.sort((a, b) => {
					if (formatEmail(a) === loginAddr) {
						return -1;
					}
					if (formatEmail(b) === loginAddr) {
						return 1;
					}
					if (a.Domain.ASCII !== b.Domain.ASCII) {
						return a.Domain.ASCII < b.Domain.ASCII ? -1 : 1;
					}
					return a.User < b.User ? -1 : 1;
				});
				domainAddressConfigs = start.DomainAddressConfigs || {};
				rejectsMailbox = start.RejectsMailbox;
				clearList();
				if (openComposeOptions) {
					(async () => {
						if (openComposeOptions.subject && openComposeOptions.subject.includes("=?")) {
							openComposeOptions.subject = await withStatus(ui("Decoding MIME words for subject"), client.DecodeMIMEWords(openComposeOptions.subject));
						}
						compose(openComposeOptions, listMailboxes, setLocationHash);
						openComposeOptions = void 0;
					})();
				}
				if (connectOpenComposeMessageID) {
					(async () => {
						const editMsgid2 = connectOpenComposeMessageID;
						connectOpenComposeMessageID = 0;
						try {
							const [mi, pm] = await withStatus(ui("Loading compose message"), Promise.all([client.MessageItem(editMsgid2), client.ParsedMessage(editMsgid2)]));
							await composeDraft(mi, pm, listMailboxes, setLocationHash);
						} catch (err) {
							window.alert(ui("Error opening draft message: ") + errmsg(err));
						}
					})();
				}
				let mailboxName = start.MailboxName;
				let mb = (start.Mailboxes || []).find((mb2) => mb2.Name === start.MailboxName);
				if (mb) {
					requestFilter.MailboxID = mb.ID;
				}
				if (mailboxName === "") {
					mailboxName = (start.Mailboxes || []).find((mb2) => mb2.ID === requestFilter.MailboxID)?.Name || "";
				}
				mailboxlistView.loadMailboxes(start.Mailboxes || [], search.active ? void 0 : mailboxName);
				if (searchView.root.parentElement) {
					searchView.ensureLoaded();
				}
				if (!mb) {
					updatePageTitle();
				}
				dom._kids(queryactivityElem, ui("loading..."));
				msglistscrollElem.appendChild(listloadingElem);
				autoReconnectResetTimer = window.setTimeout(() => {
					autoReconnect = 1;
					autoReconnectResetTimer = 0;
				}, 5 * 1e3);
				uiConnectionStatus(true);
			});
			eventSource.addEventListener("viewErr", async (e) => {
				const viewErr = checkParse(() => parser.EventViewErr(JSON.parse(e.data)));
				log("event viewErr", viewErr);
				if (viewErr.ViewID !== viewID || viewErr.RequestID !== requestID) {
					log("received viewErr for other viewID or requestID", { expected: { viewID, requestID }, got: { viewID: viewErr.ViewID, requestID: viewErr.RequestID } });
					return;
				}
				viewID = 0;
				requestID = 0;
				dom._kids(queryactivityElem);
				listloadingElem.remove();
				listerrElem.remove();
				dom._kids(listerrElem, ui("Error from server during request for messages: ") + viewErr.Err);
				msglistscrollElem.appendChild(listerrElem);
				window.alert(ui("Error from server during request for messages: ") + viewErr.Err);
			});
			eventSource.addEventListener("viewReset", async (e) => {
				const viewReset = checkParse(() => parser.EventViewReset(JSON.parse(e.data)));
				log("event viewReset", viewReset);
				if (viewReset.ViewID !== viewID || viewReset.RequestID !== requestID) {
					log("received viewReset for other viewID or requestID", { expected: { viewID, requestID }, got: { viewID: viewReset.ViewID, requestID: viewReset.RequestID } });
					return;
				}
				clearList();
				dom._kids(queryactivityElem, ui("loading..."));
				msglistscrollElem.appendChild(listloadingElem);
				window.alert(ui("Could not find message to continue scrolling, resetting the view."));
			});
			eventSource.addEventListener("viewMsgs", async (e) => {
				const viewMsgs = checkParse(() => parser.EventViewMsgs(JSON.parse(e.data)));
				log("event viewMsgs", viewMsgs);
				if (viewMsgs.ViewID !== viewID || viewMsgs.RequestID !== requestID) {
					log("received viewMsgs for other viewID or requestID", { expected: { viewID, requestID }, got: { viewID: viewMsgs.ViewID, requestID: viewMsgs.RequestID } });
					return;
				}
				msglistView.root.classList.toggle("loading", false);
				if (viewMsgs.MessageItems) {
					msglistView.addMessageItems(viewMsgs.MessageItems || [], false, requestMsgID);
				}
				if (viewMsgs.ParsedMessage && !(isMobile() && requestMsgID === 0)) {
					const ok = msglistView.openMessage(viewMsgs.ParsedMessage);
					if (!ok) {
						requestMsgID = 0;
						setLocationHash();
					}
				}
				if (viewMsgs.MessageItems && viewMsgs.MessageItems.length > 0) {
					requestAnchorMessageID = viewMsgs.MessageItems[viewMsgs.MessageItems.length - 1][0].Message.ID;
				}
				requestViewEnd = viewMsgs.ViewEnd;
				if (requestViewEnd) {
					msglistscrollElem.appendChild(listendElem);
				}
				if ((viewMsgs.MessageItems || []).length === 0 || requestViewEnd) {
					dom._kids(queryactivityElem);
					listloadingElem.remove();
					requestID = 0;
					if (requestMsgID) {
						requestMsgID = 0;
						setLocationHash();
					}
				}
			});
			eventSource.addEventListener("viewChanges", async (e) => {
				const viewChanges = checkParse(() => parser.EventViewChanges(JSON.parse(e.data)));
				log("event viewChanges", viewChanges);
				if (viewChanges.ViewID !== viewID) {
					log("received viewChanges for other viewID", { expected: viewID, got: viewChanges.ViewID });
					return;
				}
				try {
					(viewChanges.Changes || []).forEach((tc) => {
						if (!tc) {
							return;
						}
						const [tag, x] = tc;
						if (tag === "ChangeMailboxCounts") {
							const c = parser.ChangeMailboxCounts(x);
							mailboxlistView.setMailboxCounts(c.MailboxID, c.Total, c.Unread);
						} else if (tag === "ChangeMailboxSpecialUse") {
							const c = parser.ChangeMailboxSpecialUse(x);
							mailboxlistView.setMailboxSpecialUse(c.MailboxID, c.SpecialUse);
						} else if (tag === "ChangeMailboxKeywords") {
							const c = parser.ChangeMailboxKeywords(x);
							mailboxlistView.setMailboxKeywords(c.MailboxID, c.Keywords || []);
						} else if (tag === "ChangeMsgAdd") {
							const c = parser.ChangeMsgAdd(x);
							msglistView.addMessageItems([c.MessageItems || []], true, 0);
						} else if (tag === "ChangeMsgRemove") {
							const c = parser.ChangeMsgRemove(x);
							msglistView.removeUIDs(c.MailboxID, c.UIDs || []);
						} else if (tag === "ChangeMsgFlags") {
							const c = parser.ChangeMsgFlags(x);
							msglistView.updateFlags(c.MailboxID, c.UID, c.ModSeq, c.Mask, c.Flags, c.Keywords || []);
						} else if (tag === "ChangeMsgThread") {
							const c = parser.ChangeMsgThread(x);
							if (c.MessageIDs) {
								msglistView.updateMessageThreadFields(c.MessageIDs, c.Muted, c.Collapsed);
							}
						} else if (tag === "ChangeMailboxRemove") {
							const c = parser.ChangeMailboxRemove(x);
							mailboxlistView.removeMailbox(c.MailboxID);
						} else if (tag === "ChangeMailboxAdd") {
							const c = parser.ChangeMailboxAdd(x);
							mailboxlistView.addMailbox(c.Mailbox);
						} else if (tag === "ChangeMailboxRename") {
							const c = parser.ChangeMailboxRename(x);
							mailboxlistView.renameMailbox(c.MailboxID, c.NewName);
						} else {
							throw new Error("unknown change tag " + tag);
						}
					});
					faviconDraw();
				} catch (err) {
					window.alert(ui("Error processing changes (reloading advised): ") + errmsg(err));
				}
			});
		}, "connect");
		connect(false);
	}, "init");
	window.addEventListener("load", async () => {
		try {
			await init();
		} catch (err) {
			window.alert(ui("Error: ") + errmsg(err));
		}
	});
	var origLocation = {
		href: window.location.href,
		protocol: window.location.protocol,
		host: window.location.host,
		pathname: window.location.pathname,
		search: window.location.search
	};
	var showUnhandledError = /* @__PURE__ */ __name((err, lineno, colno) => {
		console.log("unhandled error", err);
		if (settings.ignoreErrorsUntil > (/* @__PURE__ */ new Date()).getTime() / 1e3) {
			return;
		}
		let stack = err.stack || "";
		if (stack) {
			log({ stack });
			const loc = origLocation;
			stack = "\n" + stack.replaceAll(loc.href, "webmail.html").replaceAll(loc.protocol + "//" + loc.host + loc.pathname + loc.search, "webmail.html");
		} else {
			stack = " (not available)";
		}
		const xerrmsg = err.toString();
		const box = dom.div(css("unhandledErrorBox", { position: "absolute", bottom: "1ex", left: "1ex", backgroundColor: "rgba(255, 110, 110, .9)", maxWidth: "14em", padding: ".25em .5em", borderRadius: ".25em", fontSize: ".8em", wordBreak: "break-all", zIndex: zindexes.shortcut }), dom.div(style({ marginBottom: ".5ex" }), "" + xerrmsg), dom.clickbutton(ui("Details"), /* @__PURE__ */ __name(function click() {
			box.remove();
			let msg = `Mox version: ${moxversion} (${moxgoos}/${moxgoarch})
Browser: ${window.navigator.userAgent}
File: webmail.html
Lineno: ${lineno || "-"}
Colno: ${colno || "-"}
Message: ${xerrmsg}

Stack trace: ${stack}
`;
			const body = `[Hi! Please replace this text with an explanation of what you did to trigger this errors. It will help us reproduce the problem. The more details, the more likely it is we can find and fix the problem. If you don't know how or why it happened, that's ok, it is still useful to report the problem. If no stack trace was found and included below, and you are a developer, you can probably find more details about the error in the browser developer console. Thanks!]

Details of the error and browser:

\`\`\`
` + msg + "```\n";
			const remove = popup(dom.div(dom._class("dialogPanel"), dom._class("errorPanel"), dom.div(dom._class("dialogHeader"), dom.h1(ui("A JavaScript error occurred")), dom.clickbutton(dom._class("btnIcon"), strokeIcon(strokePaths.x), attr.arialabel(ui("Close")), attr.title(ui("Close error details.")), /* @__PURE__ */ __name(function click2() {
				remove();
			}, "click"))), dom.div(dom._class("dialogBody"), dom.pre(dom._class("errorPre"), msg), dom.p(ui("There is a good chance this is a bug in Mox Webmail.")), dom.p(ui('Consider filing a bug report ("issue") at '), link("https://github.com/mjl-/mox/issues/new?title=" + encodeURIComponent(ui('mox webmail js error: "') + xerrmsg + '"') + "&body=" + encodeURIComponent(body), "https://github.com/mjl-/mox/issues/new"), ui(". The link includes the error details.")), dom.p(ui("Before reporting you could check previous "), link('https://github.com/mjl-/mox/issues?q=is%3Aissue+"mox+webmail+js+error%3A"', ui("webmail bug reports")), "."), dom.p(ui("Your feedback will help improve mox, thanks!"))), dom.div(dom._class("dialogFooter"), dom.clickbutton(ui("Close"), /* @__PURE__ */ __name(function click2() {
				remove();
			}, "click")), dom.clickbutton(dom._class("btnPrimary"), ui("Silence for 1 week"), /* @__PURE__ */ __name(function click2() {
				remove();
				settingsPut({ ...settings, ignoreErrorsUntil: Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3 + 7 * 24 * 3600) });
			}, "click")))));
		}, "click")), " ", dom.clickbutton(ui("Ignore"), /* @__PURE__ */ __name(function click() {
			box.remove();
		}, "click")));
		document.body.appendChild(box);
	}, "showUnhandledError");
	window.addEventListener("unhandledrejection", (e) => {
		if (!e.reason) {
			return;
		}
		const err = e.reason;
		if (err instanceof EvalError || err instanceof RangeError || err instanceof ReferenceError || err instanceof SyntaxError || err instanceof TypeError || err instanceof URIError || err instanceof ConsistencyError) {
			showUnhandledError(err, 0, 0);
		} else {
			console.log("unhandled promiserejection", err, e.promise);
		}
	});
	window.addEventListener("error", (e) => {
		showUnhandledError(e.error, e.lineno, e.colno);
	});
})();
