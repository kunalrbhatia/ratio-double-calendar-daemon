import { z } from 'zod';

// Schema for cache entries of instruments
export const InstrumentCacheEntrySchema = z.object({
  symboltoken: z.string(),
  tradingsymbol: z.string(),
  lotsize: z.coerce.number(),
  exchange: z.string(),
});
export type InstrumentCacheEntry = z.infer<typeof InstrumentCacheEntrySchema>;

// Instrument cache maps {underlying}_{expiry}_{strike}_{optionType} -> InstrumentCacheEntry
export const InstrumentCacheSchema = z.record(InstrumentCacheEntrySchema);
export type InstrumentCache = z.infer<typeof InstrumentCacheSchema>;

// Raw scrip master row validation schema
export const RawScripMasterRowSchema = z.object({
  token: z.string(),
  symbol: z.string(),
  name: z.string(),
  expiry: z.string().optional().or(z.literal('')),
  strike: z.coerce.number().optional().or(z.literal('')),
  lotsize: z.coerce.number(),
  instrumenttype: z.string().optional().or(z.literal('')),
  exch_seg: z.string(),
  tick_size: z.coerce.number().optional(),
});
export type RawScripMasterRow = z.infer<typeof RawScripMasterRowSchema>;

// Angel One response schemas
export const SmartApiLoginResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  errorcode: z.string(),
  data: z
    .object({
      jwtToken: z.string(),
      refreshToken: z.string(),
      feedToken: z.string(),
    })
    .optional()
    .nullable(),
});
export type SmartApiLoginResponse = z.infer<typeof SmartApiLoginResponseSchema>;

export const SmartApiOrderResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  errorcode: z.string(),
  data: z
    .object({
      script: z.string().optional(),
      orderid: z.string(),
      uniqueorderid: z.string().optional(),
    })
    .optional()
    .nullable(),
});
export type SmartApiOrderResponse = z.infer<typeof SmartApiOrderResponseSchema>;

export const OrderBookItemSchema = z.object({
  orderid: z.string(),
  status: z.string(), // COMPLETE, REJECTED, CANCELLED, etc.
  tradingsymbol: z.string(),
  symboltoken: z.string(),
  transactiontype: z.string(),
  quantity: z.coerce.number(),
  price: z.coerce.number(),
  averageprice: z.coerce.number().optional(),
  text: z.string().optional(),
});
export type OrderBookItem = z.infer<typeof OrderBookItemSchema>;

export const SmartApiOrderBookResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  errorcode: z.string(),
  data: z.array(OrderBookItemSchema).optional().nullable(),
});
export type SmartApiOrderBookResponse = z.infer<typeof SmartApiOrderBookResponseSchema>;

export const SmartApiLtpResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  errorcode: z.string(),
  data: z
    .object({
      exchange: z.string(),
      tradingsymbol: z.string(),
      symboltoken: z.string(),
      ltp: z.coerce.number(),
    })
    .optional()
    .nullable(),
});
export type SmartApiLtpResponse = z.infer<typeof SmartApiLtpResponseSchema>;

// Batch margin request response schema
export const MarginCalculatorResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  errorcode: z.string(),
  data: z
    .object({
      totalMargin: z.coerce.number(),
      marginUtilized: z.coerce.number().optional(), // standard response field
      netMaxMargin: z.coerce.number().optional(),
    })
    .optional()
    .nullable(),
});
export type MarginCalculatorResponse = z.infer<typeof MarginCalculatorResponseSchema>;

// State Tracking Positions schema (week-wise)
export const OrderRecordSchema = z.object({
  symboltoken: z.string(),
  tradingsymbol: z.string(),
  transactiontype: z.enum(['BUY', 'SELL']),
  quantity: z.number(),
  exchange: z.string(),
  orderid: z.string(),
  status: z.string(),
  price: z.number(),
});
export type OrderRecord = z.infer<typeof OrderRecordSchema>;

export const WeeklyPositionSchema = z.object({
  week: z.string(), // e.g. 2026-W27
  status: z.enum(['open', 'closed', 'skipped']),
  marginUtilized: z.number(),
  orders: z.array(OrderRecordSchema),
  realizedPnl: z.number(),
  skippedThisWeek: z.boolean(),
  vixAtEntry: z.number().optional(),
});
export type WeeklyPosition = z.infer<typeof WeeklyPositionSchema>;
