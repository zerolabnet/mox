# mox-webmail-theme

Переносимый пакет кастомизации webmail для [mox](https://github.com/mjl-/mox).

**Базовая версия upstream:** v0.0.17  
**Версия темы:** 3 (см. `VERSION`)

## Содержимое

```
mox-webmail-theme/
├── README.md                 — эта инструкция
├── CHANGELOG.md              — история изменений
├── VERSION                   — base_version + theme_version
├── apply.sh                  — применить патчи к дереву mox
├── pack.sh                   — пересобрать патчи и создать .tar.gz
├── regenerate-patches.sh     — перегенерировать patches/ из overlay
├── patches/                  — unified diff относительно v0.0.17
│   ├── all-in-one.patch
│   ├── lib.ts.patch
│   ├── webmail.ts.patch
│   ├── webmail.go.patch
│   ├── compose.go.patch
│   ├── compose_test.go.patch
│   ├── fonts.css.patch
│   ├── webmail.html.patch
│   ├── msg.html.patch
│   └── text.html.patch
├── overlay/                  — готовые файлы целиком (для merge / сравнения)
│   ├── webmail/
│   │   ├── lib.ts
│   │   ├── webmail.ts
│   │   ├── webmail.go
│   │   ├── fonts.css
│   │   ├── fonts/*.woff2
│   │   ├── webmail.html, msg.html, text.html
│   └── message/
│       ├── compose.go
│       └── compose_test.go
└── upstream-v0.0.17/         — оригиналы upstream для diff
```

### Затронутые файлы

| Файл | Роль |
|------|------|
| `webmail/lib.ts` | CSS-переменные, палитра, Inter, базовые стили |
| `webmail/webmail.ts` | Основной UI, компоненты, диалоги, mobile |
| `webmail/webmail.go` | Раздача `/fonts.css` и `/fonts/*.woff2` (go:embed) |
| `webmail/fonts.css` | @font-face для Inter |
| `webmail/fonts/` | WOFF2 (latin + cyrillic, 400/600/700) |
| `webmail/favicon.svg` | Favicon webmail (относительный путь `favicon.svg`) |
| `webmail/webmail.html` | Shell SPA |
| `webmail/msg.html` | Shell просмотра письма |
| `webmail/text.html` | Shell text-part |
| `message/compose.go` | Q-encoding Subject: сохранение пробелов в non-ASCII темах |
| `message/compose_test.go` | Тесты Subject encoding |

После правок **обязательно**:

```bash
make install-frontend   # один раз
make frontend
go build -o mox .
```

---

## Быстрое применение на чистый mox v0.0.17

```bash
cd /path/to/mox-v0.0.17
/path/to/mox-webmail-theme/apply.sh check
/path/to/mox-webmail-theme/apply.sh apply
make frontend
go build -o mox .
```

`apply.sh apply` также копирует `overlay/webmail/fonts/` (бинарные woff2 не в патче).

---

## Создать архив для переноса

Из корня mox:

```bash
chmod +x mox-webmail-theme/pack.sh
./mox-webmail-theme/pack.sh
```

Создаёт `mox-webmail-theme-v0.0.17-theme3.tar.gz` в корне проекта.

---

## Применение на новую версию mox (v0.0.16+)

### 1. Проверка

```bash
cd /path/to/mox-NEW_VERSION
../mox-webmail-theme/apply.sh check
```

Если `patch` падает — пофайлово:

```bash
./mox-webmail-theme/apply.sh apply lib.ts
./mox-webmail-theme/apply.sh apply webmail.html
./mox-webmail-theme/apply.sh apply msg.html
./mox-webmail-theme/apply.sh apply text.html
./mox-webmail-theme/apply.sh apply fonts.css
./mox-webmail-theme/apply.sh apply webmail.go
./mox-webmail-theme/apply.sh apply compose.go
./mox-webmail-theme/apply.sh apply webmail.ts   # чаще всего конфликтует
```

### 2. Merge с помощью Cursor

Принесите в чат:

1. Версию mox (тег/коммит)
2. Архив `mox-webmail-theme-v0.0.17-theme3.tar.gz` или папку
3. Вывод `apply.sh check` или список `.rej`

Сравнивайте три стороны:

| Сторона | Где |
|---------|-----|
| upstream v0.0.17 | `upstream-v0.0.17/` |
| наша тема | `overlay/webmail/` |
| новый mox | `webmail/` в новой версии |

### 3. Логические блоки в `webmail.ts`

| Блок | Маркеры |
|------|---------|
| Mobile | `MOBILE_BP`, `isMobile`, `setMobilePane` |
| Кнопки | `// Buttons and input elements.` |
| Top bar | `// Dark top navigation bar.` |
| Search | `.searchOverlay`, `newSearchView` |
| Диалоги | `.dialogPanel`, `dialogHeader`, `cmdSettings`, `cmdHelp` |
| Refine / mailboxes | `.refineBar`, `.mailboxesRegion` |
| Compose | `.composePopup`, `cmdCompose` |

### 4. Проверка

```bash
make frontend
go build -o mox .
```

Чеклист: top bar, search, help/settings dialogs, compose, mobile drawer, шрифт Inter (Network → `/fonts.css`).

---

## Overlay (полная замена)

Только для отладки или очень близких версий:

```bash
cp mox-webmail-theme/overlay/webmail/lib.ts webmail/
cp mox-webmail-theme/overlay/webmail/webmail.ts webmail/
cp mox-webmail-theme/overlay/webmail/webmail.go webmail/
cp mox-webmail-theme/overlay/webmail/fonts.css webmail/
cp -R mox-webmail-theme/overlay/webmail/fonts webmail/
cp mox-webmail-theme/overlay/webmail/*.html webmail/
make frontend
```

На новой версии mox **не копируйте слепо** `webmail.ts` / `webmail.go` — потеряете upstream-фиксы.

---

## Обновление темы после merge на новый upstream

1. Сохраните оригиналы новой версии в `upstream-vX.Y.Z/`
2. Обновите `overlay/webmail/` из рабочего `webmail/`
3. Запустите `./regenerate-patches.sh`
4. Обновите `VERSION`, `CHANGELOG.md`, `pack.sh` → новый архив
