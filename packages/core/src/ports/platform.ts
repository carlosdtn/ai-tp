import type { Timestamp, TraceId } from "../domain/primitives";

export type Clock = {
  now(): Timestamp;
};

export type TraceIdFactory = {
  create(): TraceId;
};
