import { useEffect } from "react";
import {
  readRuntimeRegistrationConfigs,
  registerExternalComponents,
} from "../core/registy";

export function RuntimeRegistrationBootstrap() {
  useEffect(() => {
    const storedConfigs = readRuntimeRegistrationConfigs();

    for (const config of storedConfigs) {
      void registerExternalComponents(config).catch((error) => {
        console.warn("Failed to restore runtime registration", error);
      });
    }
  }, []);

  return null;
}
