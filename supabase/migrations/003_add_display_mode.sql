-- Add display_mode column to calendars table
ALTER TABLE calendars
ADD COLUMN display_mode TEXT NOT NULL DEFAULT 'calendar_view'
CHECK (display_mode IN ('card_grid', 'calendar_view'));

-- Add comment for documentation
COMMENT ON COLUMN calendars.display_mode IS 'Display mode for calendar: card_grid (simple 7-col grid) or calendar_view (traditional month calendar with day headers)';
