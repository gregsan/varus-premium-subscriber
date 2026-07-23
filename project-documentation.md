# Архитектура и фактическая логика проекта ( Varus Premium Demo )

Данный документ описывает реальное устройство, архитектуру данных, поведение компонентов и клиенскую логику прототипа **Varus Premium**. Предназначен для быстрого вхождения в контекст разработчиков и AI-кодинг-агентов (Claude Code, Cursor и др.).

---

## 1. Общий обзор и технический стек

Проект представляет собой **клиентское (Front-end only) демо мобильного веб-приложения** для программы лояльности/подписки.

- **Фреймворк:** Next.js 15 (App Router, React 19)
- **Язык:** TypeScript
- **Стилизация:** Tailwind CSS v4 + `globals.css` (на базе CSS-переменных в формате `oklch`)
- **Компоненты UI:** Radix UI / `shadcn/ui` (Button, Dialog, Sheet, Input, Select, Textarea, Accordion)
- **Анимации:** `framer-motion`
- **Иконки:** `lucide-react`
- **Состояние и персистентность:** `localStorage` (без бекенда и БД)

---

## 2. Структура проекта

```text
.
├── app/
│   ├── layout.tsx                # Корневой лейаут
│   ├── page.tsx                  # Главная страница (редирект на /subscribe или /dashboard)
│   ├── globals.css               # Дизайн-система (oklch темы)
│   ├── subscribe/page.tsx        # Paywall / Презентация подписки
│   ├── dashboard/page.tsx        # Экран подписчика (статистика, сервисы)
│   └── account/page.tsx          # Управление аккаунтом и биллингом
├── components/
│   ├── mobile-frame.tsx          # Обгортка-эмулятор мобильного экрана (max-w-[560px])
│   ├── block-wrapper.tsx         # Карточка-секция с анимированным появлением (framer-motion)
│   ├── checkout/
│   │   └── checkout-sheet.tsx    # Модальный процесс оплаты (Method -> Card -> Processing -> Success)
│   ├── paywall/                  # Блоки страницы /subscribe
│   │   ├── retail-benefits-block.tsx
│   │   ├── partner-offers-block.tsx
│   │   ├── insurance-block.tsx
│   │   └── digital-services-block.tsx
│   └── blocks/                   # Блоки страницы /dashboard
│       ├── usage-stats-block.tsx
│       ├── redeem-code-screen.tsx # Штрихкод/QR для использования на кассе
│       ├── partner-services-block.tsx
│       ├── insurance-dashboard-block.tsx
│       └── retail-benefits-dashboard-block.tsx
├── hooks/
│   ├── use-subscription.ts       # Главный хук работы со стором подписки
│   └── use-is-mobile.ts          # Хук адаптивности (виден ли экран < 768px)
├── lib/
│   ├── tenant-config.ts          # Конфиг для мультитенантности / "коробки"
│   ├── subscription-store.ts     # Типы и менеджер состояния localStorage
│   ├── paywall-data.ts           # Статические данные для Paywall
│   └── dashboard-data.ts         # Статические данные для Dashboard
└── public/                       # Иконки и заглушки

```

---

## 3. Управление состоянием (Subscription Store)

Вся логика работы подписки сосредоточена в **`lib/subscription-store.ts`** и хуке **`hooks/use-subscription.ts`**.

### 3.1. Модель данных (`SubscriptionState`)

```ts
export type SubscriptionStatus = 'none' | 'active' | 'cancelling' | 'expired'

export interface SubscriptionState {
  status: SubscriptionStatus
  planId: string
  startedAt: string | null
  nextBillingDate: string | null
  cancelAtPeriodEnd: boolean
  paymentMethod: { type: 'card' | 'google_pay' | 'apple_pay'; last4?: string } | null
  usage: {
    deliveriesUsed: number
    deliveriesLimit: number | null // null = безлимит
    bonusPointsEarned: number
    savedAmount: number
  }
  activatedServices: string[]
  insurance: {
    policyActive: boolean
    claimSubmitted: boolean
    claimType?: string
    claimDescription?: string
  }
  billingHistory: Array<{
    id: string
    date: string
    amount: number
    status: 'paid' | 'refunded'
  }>
}

```

### 3.2. Ключевые методы хука `useSubscription()`

1. **`activateSubscription(method)`**:
* Менет статус на `'active'`.
* Генерирует текущую дату `startedAt` и `nextBillingDate` (+1 месяц).
* Записывает способ оплаты, устанавливает стартовый `billingHistory` (первое списание — 1 грн).
* Наполняет начальную статистику использования (доставки, бонусы, экономия).


2. **`cancelSubscription({ immediate })`**:
* При `immediate: false` → `status = 'cancelling'`, `cancelAtPeriodEnd = true` (подписка действует до конца оплаченного периода).
* При `immediate: true` → `status = 'none'`, состояние полностью сбрасывается.


3. **`resumeSubscription()`**:
* Переводит подписку из статуса `'cancelling'` обратно в `'active'`.


4. **`activateService(serviceId)`**:
* Добавляет ID партнерского или цифрового сервиса в массив `activatedServices`.


5. **`activateInsurance()`** & **`submitInsuranceClaim(claimData)`**:
* `activateInsurance()` делает `insurance.policyActive = true`.
* `submitInsuranceClaim()` сохраняет заявку на страховой случай и делает `claimSubmitted = true`.



### 3.3. Персистентность и SSR

* Все данные сохраняются в `localStorage` по ключу `varus_subscription_state`.
* Чтобы избежать гидратационных ошибок в Next.js (SSR vs Client), хук считывает данные из `localStorage` только после монтирования компонента в `useEffect`.

---

## 4. Описание страниц и маршрутизация

Защита роутов осуществляется на клиенте через `useEffect`:

### 4.1. Paywall / Презентация (`/subscribe`)

* **Назначение:** Конвертация пользователя в подписчика.
* **Поведение при активной подписке:** Если `status === 'active'`, вместо обычной формы покупки наверху отображается баннер "У вас уже есть активная подписка" с кнопкой быстрого перехода в `/dashboard`.
* **Компоненты:**
* Hero-блок с описанием выгод и плашкой стоимости ("1 грн первый месяц, затем 199 грн/мес").
* Блоки преимуществ: ритейл, партнеры, страхование, цифровые сервисы.
* Нижний **Sticky CTA bar** ("Спробувати за 1 грн"), открывающий Checkout Sheet.



### 4.2. Checkout Flow (`checkout-sheet.tsx`)

Процесс имитации оплаты разбит на 4 шага (`step`):

1. `method` — выбор способа (Карта, Google Pay, Apple Pay). При выборе Apple/Google Pay шаг `card-form` пропускается.
2. `card-form` — ввод номера карты, MM/YY, CVC (валидация упрощенная).
3. `processing` — таймер-имитация запроса на 1.5 секунды.
4. `success` — экран успеха, на котором вызывается `activateSubscription()`. Автоматический редирект на `/dashboard` через 3 секунды или по кнопке.

### 4.3. Dashboard / Кабинет (`/dashboard`)

* **Ограничение:** Если `status === 'none'`, происходит авторедирект на `/subscribe`.
* **Основной функционал:**
* **Usage stats:** Карточка с прогрессом доставок, сэкономленными деньгами и накопленными бонусами.
* **Redeem code screen:** Кнопка "Показати купон на касі" открывает модальное окно с заглушкой штрихкода/QR-кода для сканирования.
* **Partner Services:** Карточки сервисов (Kino UA, Megogo и др.). По клику открывается Sheet/Dialog с деталями. Если сервис еще не активирован — кнопка "Отримати доступ", которая моментально переводит статус в "Активний ✓".
* **Insurance:** Пошаговая логика (1. Оформить -> 2. Подать заявку на случай -> 3. Статус "На рассмотрении").
* **Порядок блоков:** Выводится динамически на основе `TENANT_CONFIG.dashboardBlocks`.



### 4.4. Account / Управление (`/account`)

* **Ограничение:** Если `status === 'none'`, происходит авторедирект на `/subscribe`.
* **Основной функционал:**
* Информация о профиле пользователя.
* Управление тарифом и картой (отображение даты следующего списания, `last4` карты).
* Управление отменой: Диалог с выбором мягкого или мгновенного скасования.
* Возможность возобновить подписку (если она в статусе `cancelling`).
* История платежей из `billingHistory`.
* FAQ и контакты поддержки.



---

## 5. Мультитенантность и кастомизация ("Коробка")

Проект спроектирован так, чтобы его можно было легко брендировать под другого ритейлера без изменения кода компонентов.

### 5.1. Конфигурация в `lib/tenant-config.ts`

```ts
export const TENANT_CONFIG = {
  brandName: 'Varus Premium',
  planName: 'Premium',
  dashboardBlocks: [
    'usage-stats',
    'redeem-coupon',
    'partner-services',
    'insurance',
    'retail-benefits'
  ],
}

```

### 5.2. Дизайн-система и темы

Все цвета объявлены в `app/globals.css` через переменные CSS:

* `--primary`: основной бренд-цвет (по умолчанию оранжевый Varus `oklch(0.66 0.17 48)`).
* `--accent`: фоновый акцентный цвет для плашек.
* Компоненты **не должны использовать жестко заданные HEX-цвета** (за исключением уникальных графических градиентов).

---

## 6. Рекомендации для внесения правок (для LLM / Dev)

1. **Изменение текстового контента:**
* Если нужно изменить список сервисов, страховых предложений или бонусов — редактируйте **`lib/paywall-data.ts`** и **`lib/dashboard-data.ts`**.


2. **Изменение структуры Dashboard:**
* Изменяйте порядок элементов в `TENANT_CONFIG.dashboardBlocks` внутри `lib/tenant-config.ts`.


3. **Добавление нового функционала в подписку:**
* Добавьте новое поле в интерфейс `SubscriptionState` в `lib/subscription-store.ts`.
* Обновите хук `useSubscription.ts`, добавив методы записи и дефолтные значения.


4. **Адаптивность UI:**
* Для модальных окон используется паттерн: `Sheet` (снизу) для экранов `< 768px` и `Dialog` (по центру) для десктопа. Проверку осуществлять через хук `useIsMobile()`.
