CREATE OR REPLACE FUNCTION increment_share_view(card_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE share_cards
  SET view_count = view_count + 1
  WHERE id = card_id;
END;
$$;
