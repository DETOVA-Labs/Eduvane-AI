/**
 * GEMINI SERVICE (DEPRECATED / NEUTRALIZED)
 * 
 * ARCHITECTURAL NOTICE:
 * This service previously handled direct AI model calls in TypeScript.
 * In the Active System Foundation architecture, all intelligence must reside
 * in the Python AI Engine.
 * 
 * This file is retained temporarily only to prevent import errors during the transition,
 * but it contains no logic and throws errors if accessed.
 */

import { UserRole } from "../types";

export class GeminiService {
  constructor() {
    // No-op
  }

  // Primitives are disabled
  async perceive(base64Image: string, mimeType: string): Promise<string> {
    throw new Error("Architecture Violation: Frontend/Gateway cannot execute Perception.");
  }

  async interpret(extractedText: string): Promise<any> {
    throw new Error("Architecture Violation: Frontend/Gateway cannot execute Interpretation.");
  }

  async reason(
    base64Image: string | undefined, 
    mimeType: string | undefined, 
    extractedText: string, 
    context: any,
    userInstruction: string | undefined,
    mode: 'fast' | 'deep',
    historyContext?: string, 
    userRole?: UserRole
  ): Promise<any> {
    throw new Error("Architecture Violation: Frontend/Gateway cannot execute Reasoning.");
  }

  async streamLearningTask(message: string, userRole?: UserRole): Promise<any> {
    throw new Error("Architecture Violation: Frontend/Gateway cannot execute Chat.");
  }
}

export const geminiService = new GeminiService();
