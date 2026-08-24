CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  product_category TEXT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  order_reference TEXT,
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT purchases_status_check CHECK (status IN ('available','pending','processing','revoked'))
);

GRANT SELECT, INSERT ON public.purchases TO authenticated;
GRANT ALL ON public.purchases TO service_role;

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.purchases FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their own purchases"
  ON public.purchases FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX purchases_user_id_purchased_at_idx ON public.purchases (user_id, purchased_at DESC);