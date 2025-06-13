# Dokumentacja testów

## Testy

### 1. Test API Promptów (`tests/prompts.test.js`)
- **should return 401 for unauthorized GET**
  - Sprawdza czy endpoint `/api/prompts` wymaga autoryzacji
  - Weryfikuje czy zwracany jest odpowiedni kod błędu (401)
  - Sprawdza czy odpowiedź zawiera komunikat o błędzie

### 2. Test API (`tests/e2e/api.test.js`)

#### Health Check
- **should return 200 OK for health check endpoint**
  - Sprawdza endpoint `/api/health`
  - Weryfikuje czy zwracany jest kod 200
  - Sprawdza czy odpowiedź zawiera status "ok"

#### Authentication
- **should return 401 for protected route without token**
  - Sprawdza czy chronione endpointy wymagają tokenu
  - Weryfikuje czy zwracany jest kod 401 dla niezabezpieczonych requestów
  - Sprawdza czy odpowiedź zawiera komunikat o błędzie

## Pokrycie kodem

Aktualne pokrycie kodu testami:
- Modele (Prompt.js, User.js): 100%
- Middleware: 46.15%
- Routes: 24.7%
- Utils: 18.18%

## Uruchamianie testów

### Wszystkie testy
```bash
npm run test:all
```

### Testy jednostkowe
```bash
npm run test
```
Uruchamia testy z katalogu `tests/unit/` (obecnie brak testów jednostkowych)

### Testy E2E
```bash
npm run test:e2e
```
Uruchamia testy z katalogu `tests/e2e/`

### Testy z pokryciem
```bash
npm run test:coverage
```
Generuje raport pokrycia kodu testami

## Wymagania do uruchomienia testów

1. MongoDB musi być uruchomiony lokalnie lub dostępny przez zmienną środowiskową `MONGODB_URI`
2. Zmienna środowiskowa `JWT_SECRET` musi być ustawiona (domyślnie używana jest wartość 'test-secret' w testach)
3. Wszystkie zależności muszą być zainstalowane (`npm install`)

## CI/CD Pipeline

Aplikacja wykorzystuje GitHub Actions do automatycznego uruchamiania testów. Pipeline jest skonfigurowany w pliku `.github/workflows/ci.yml` i wykonuje następujące kroki:

1. Uruchamia się automatycznie przy:
   - Push do gałęzi main
   - Tworzeniu Pull Request do gałęzi main

2. Wykonuje następujące kroki:
   - Uruchamia kontener MongoDB
   - Konfiguruje Node.js v18.20.8
   - Instaluje wymagane zależności systemowe (libssl1.1)
   - Instaluje zależności npm
   - Uruchamia wszystkie testy

3. Wymagane zmienne środowiskowe:
   - `MONGODB_URI`: mongodb://localhost:27017/test-db
   - `JWT_SECRET`: test-secret

Pipeline można monitorować w zakładce "Actions" na GitHubie.

## Plan rozwoju testów

W przyszłości planowane jest dodanie następujących testów:

1. Testy jednostkowe:
   - Test Middleware (authMiddleware.test.js)
   - Test Modeli (Prompt.test.js)
   - Test Obsługi Błędów (errorHandling.test.js)

2. Testy E2E:
   - Test tworzenia nowego promptu
   - Test pobierania listy promptów
   - Test aktualizacji i usuwania promptów 