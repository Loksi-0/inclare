# Inclare

**Inclare** — платформа для фотографов с архивацией и обработкой всех видов RAW фотографий. Изучайте самые популярные посты на бесконечной плоскости вместо привычной ленты.

---

### Стек технологий

* **Frontend**
  * Next.js
  * tRPC
  * Tanstack Query
  * Panzoom
  * React Hook Form
  * GSAP
  * MobX

* **Backend**
  * Hono
  * tRPC
  * Exiftool
  * Redis
  * Prisma (Postgres)
  * Sharp
  * Zod

* **Infrastructure**
  * Docker
  * Docker Compose
  * Nginx
  * Turbo Monorepo

---

### Ключевые фичи

* Серверная авторизация через HTTPOnly cookie и JWT токены с автоматическим продлением сессии

* Упор на серверный рендеринг и серверные запросы. Везде, где необходима инвалидация и клиентское взаимодействие, прокидывается initialData из серверного компонента

* Серверная защита роутов через proxy Next.js

* Защита постов и каждой фотографии приватных пользователей

* Оптимистичные обновления в компонентах лайка, тумблера и инпута аватарки

* Конвертация любых RAW фотографий в легкие и популярные форматы для превью

* Сохранение exif тегов фотографий с помощью exiftool

* Собственная система кэширования, защиты и оптимизации изображений под требуемый размер, раздача через Nginx и заголовок X-Accel-Redirect

* GSAP для производительных и красивых анимаций

* Уникальный алгоритм "падающей звезды" (на фронтенде "битый пиксель") - периодически на плоскости появляются посты, которые резко набрали популярность, а затем угасли

* tRPC для быстрого написания бекенда и сквозной типизации

* Концепция Backend for Frontend - бекенд отдает только необходимые данные, а фронтенд отвечает за UI

* Роли пользователей и модерация

* Админка с гибкой регулировкой переменных алгоритмов

---

### Инструкция по запуску (Docker)

Проект полностью контейнеризирован и предполагает запускаться через Docker, так что для запуска вам понадобятся Docker и Docker Compose

1. **Подготовка проекта:**

  * Создайте папку, в которой будет храниться проект (например, /var/www/inclare)

    ```bash
    mkdir /var/www/inclare
    cd /var/www/inclare
    ```

  * Скопируйте проект в эту папку

    ```bash
    git clone https://github.com/Loksi-0/inclare.git .
    ```

  * Создайте в корне проекта файл .env и заполните его по примеру из файла .env.example

    **Важно!** Если вы не собираетесь использовать Nginx, оставьте NODE_ENV=development. Значение NODE_ENV=production настраивает проект на использование технологий Nginx (например раздача изображений через X-Accel-Redirect)

2. **Запуск:**

  Запустите проект командой:

  ```bash
  docker compose up --build -d
  ```

  Команда автоматически соберет фронтенд и бекенд и поднимет все необходимые базы данных
  
  После этого проект будет доступен локально по портам, указанным в .env (API_PUBLIC_PORT и CLIENT_PUBLIC_PORT)

3. **Настройка Nginx (опционально):**

  Для этого пункта вам понадобится установленный на сервере Nginx

  * Создайте файл inclare.conf в /etc/nginx/sites-available

  ```bash
  touch /etc/nginx/sites-available/inclare.conf
  ```

  * Скопируйте содержимое конфига nginx.example.conf в созданный файл

  * Измените все порты и пути под ваш проект и структуру папок

  * Свяжите конфиг с папкой sites-enabled

  ```bash
  ln -s /etc/nginx/sites-available/inclare.conf /etc/nginx/sites-enabled
  ```

  * Перезагрузите nginx, чтобы применить изменения

  ```bash
  systemctl reload nginx
  ```

4. **Доступ к приложению:**

  * Без Nginx - проект будет доступен локально по тем портам, которые вы указали в .env по такому принципу:

    * **Frontend**: http://localhost:[CLIENT_PUBLIC_PORT]
    * **Backend**: http://localhost:[API_PUBLIC_PORT]

  * С Nginx - проект будет доступен по настроенному вами домену, например https://inclare.ru

---

### Инструкция по подготовке проекта для разработки

* Создайте папку для проекта

  ```bash
  mkdir inclare
  cd inclare
  ```

* Скопируйте проект в эту папку

  ```bash
  git clone https://github.com/Loksi-0/inclare.git .
  ```

* Создайте .env в соответствии с .env.example в корне и в следующих папках:
  * apps/backend
  * apps/frontend
  * packages/db

* Скачайте все необходимые зависимости и сгенерируйте типы БД

  ```bash
  pnpm install
  pnpm generate
  ```

* Запустите базы данных Postgres и Redis. 
  
  Redis удобно запускать через Docker:

  ```bash
  docker run --name inclare-redis -p 6379:6379 -d redis
  ```

* Запустите режим разработки

  ```bash
  pnpm dev
  ```

---

<div style='display: flex; align-items: center; justify-content: center; font-size: 40px;'>
  <a href='https://inclare.ru'>
    <b>Inclare</b>
  </a>
</div>
