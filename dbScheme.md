-- 1. Включаем расширение для генерации UUID (если еще не включено)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Создаем перечисления (Enum) для ролей и статусов
CREATE TYPE user_role AS ENUM ('ADMIN', 'WORKER');
CREATE TYPE activity_status AS ENUM ('IN_PROGRESS', 'INACTIVE');

-- 3. Сначала создаем таблицу Departments (так как на нее ссылается Users)
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL
);

-- 4. Создаем таблицу Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department_id UUID, -- Может быть NULL для админа, как указано в схеме
    created_at TIMESTAMP DEFAULT NOW(),
    
    -- Внешний ключ на отделы
    CONSTRAINT fk_user_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE SET NULL
);

-- 5. Создаем таблицу Activities (Активность сотрудников)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    status activity_status NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE, -- Дата записи для истории
    updated_at TIMESTAMP DEFAULT NOW(),
    
    -- Внешний ключ на пользователей
    CONSTRAINT fk_activity_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);