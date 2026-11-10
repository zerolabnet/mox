# Changelog — mox-webmail-theme

Based on upstream **mox v0.0.17**. Port of the theme previously maintained for v0.0.15.

## Theme v3 (2026-10-15)

- Отступ вложенных ящиков: `marginLeft` на иконке (вместе с подписью), формула `parents * 2/3 em`
- Десктопная кнопка Compose: иконка Lucide `mail-pen` и подпись «Compose»
- Мобильная Compose: та же иконка `mail-pen`

## Theme v2 (2026-10-15)

- Строки ящиков как SSClash `.side-link`: скругление 8px, фон accent-soft для hover и active, без нижней границы и левой полоски
- Stroke-SVG (Lucide, 18px) у ящиков по special-use и у глифов меню, Compose, overflow, очистки поиска, Back и кнопок × + −
- `--radius` 8px

## Theme v1 (2026-10-15)

### Перенос с v0.0.15
- Дизайн-система: calm grey, accent `#5b7083`, Inter self-hosted, favicon
- Mobile webmail (< 768px): drawer папок, отдельные экраны списка и письма, fullscreen compose
- Диалоги `dialogPanel`, badge непрочитанных, Labels popover, выравнивание высоты полей и кнопок
- Поле поиска в тёмной шапке: полупрозрачные цвета, высота как у соседних кнопок
- Относительные `fonts.css` / `favicon.svg` и MIME через `filepath.Base` в `ServeContent`

### Subject encoding
- `message/compose.go`: пробелы в Subject с non-ASCII не теряются при Q-encoding (RFC 2047). Слова режутся только по U+0020; соседние non-ASCII слова кодируются одним encoded-word. Сохранена запись через `strings.Builder` из v0.0.17.
- `message/compose_test.go`: roundtrip для русского, грузинского, смешанных тем и `\n`/`\r`

### Сохранено из upstream v0.0.17
- ES-модули и esbuild
- Черновик в hash (`compose:<id>`), фильтр Flagged, `MessageMove` с третьим аргументом
- Переподключение после `serverShutdown`, cache-bust `?v=`
