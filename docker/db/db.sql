CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;

CREATE TABLE IF NOT EXISTS public.advisors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    name character varying(64) NOT NULL,
    password character varying NOT NULL
);

CREATE TABLE IF NOT EXISTS public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    advisor_id uuid NOT NULL,
    price numeric(7,2) NOT NULL,
    name character varying(64) NOT NULL,
    description text
);

ALTER TABLE public.advisors OWNER TO postgres;
ALTER TABLE public.products OWNER TO postgres;

ALTER TABLE public.advisors ADD CONSTRAINT advisors_pkey PRIMARY KEY (id);
ALTER TABLE public.products ADD CONSTRAINT products_pkey PRIMARY KEY (id);
ALTER TABLE public.products ADD CONSTRAINT products_advisor_id_fkey FOREIGN KEY (advisor_id) REFERENCES public.advisors(id) ON UPDATE CASCADE ON DELETE CASCADE;

CREATE UNIQUE INDEX advisors_email_index ON public.advisors USING BTREE (email);
CREATE INDEX products_advisor_id_index ON public.products USING BTREE (advisor_id);