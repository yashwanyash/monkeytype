import type { Response, NextFunction } from "express";
import MonkeyError from "../utils/error";
import { Configuration } from "@monkeytype/contracts/schemas/configuration";
import { TsRestRequestWithCtx } from "./auth";
import { TsRestRequestHandler } from "@ts-rest/express";

export type ValidationOptions<T> = {
  criteria: (data: T) => boolean;
  invalidMessage?: string;
};

/**
 * This utility checks that the server's configuration matches
 * the criteria.
 */
export function validate<T extends AppRouter | AppRoute>(
  options: ValidationOptions<Configuration>
): TsRestRequestHandler<T> {
  const {
    criteria,
    invalidMessage = "This service is currently unavailable.",
  } = options;

  return (req: TsRestRequestWithCtx, _res: Response, next: NextFunction) => {
    const configuration = req.ctx.configuration;

    const validated = criteria(configuration);
    if (!validated) {
      throw new MonkeyError(503, invalidMessage);
    }

    next();
  };
}
