# Dokumentacja testów

## Testy jednostkowe

### 1. Test API Promptów (`tests/prompts.test.js`)
- **should return 401 for unauthorized GET**
  - Sprawdza czy endpoint `/api/prompts` wymaga autoryzacji
  - Weryfikuje czy zwracany jest odpowiedni kod błędu (401)
  - Sprawdza czy odpowiedź zawiera komunikat o błędzie

## Testy E2E

### 1. Test API (`tests/e2e/api.test.js`)

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
   - Konfiguruje Node.js v18
   - Instaluje zależności
   - Uruchamia wszystkie testy

3. Wymagane zmienne środowiskowe:
   - `MONGODB_URI`: mongodb://localhost:27017/test-db
   - `JWT_SECRET`: test-secret

Pipeline można monitorować w zakładce "Actions" na GitHubie. 