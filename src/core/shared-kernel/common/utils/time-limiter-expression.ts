import { TimeLimiterParams } from '@shared-kernel/common/guards/time.guard';

export const TimeLimiterExpression: Record<string, TimeLimiterParams> = {
  MIDNIGHT_HOURS: { startHour: 23, endHour: 4 },
};
