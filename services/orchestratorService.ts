import { UnifiedInput, OrchestratorEvent, UserRole, AIContext } from '../types';
import { getUserProfile } from './persistenceService';
import { aiEngine } from './aiEngine';

/**
 * EDUVANE BACKEND GATEWAY (Client-Side Simulation)
 * 
 * ROLE: Transport & Session Control Only.
 * - No Intelligence.
 * - No Intent Detection.
 * - No Response Construction.
 * 
 * It forwards inputs to the AI Engine and streams events back to the UI.
 */
export class OrchestratorService {

  private userProfileLoaded = false;
  private currentRole?: UserRole;
  private currentName?: string;

  /**
   * Process a UnifiedInput from the UI.
   * Strictly forwards to AI Engine.
   */
  async *processInput(input: UnifiedInput, isGuest: boolean): AsyncGenerator<OrchestratorEvent> {
    
    // 1. Session Context Hydration (Infrastructure, not Intelligence)
    if (!this.userProfileLoaded) {
        if (!isGuest) {
            const profile = getUserProfile();
            if (profile) {
                this.currentRole = profile.role;
                this.currentName = profile.name;
            }
        }
        this.userProfileLoaded = true;
    }

    const context: AIContext = {
        role: this.currentRole,
        userName: this.currentName
    };

    // 2. Forward to AI Engine
    // The Gateway does NOT decide if this is a "greeting" or a "submission".
    // The Engine handles everything.
    try {
        const engineStream = aiEngine.execute(input, context);

        for await (const event of engineStream) {
            // Forward events verbatim to UI
            // Mapping AIEvent to OrchestratorEvent for UI compatibility
            switch (event.type) {
                case 'PHASE_UPDATE':
                    yield { type: 'PHASE_UPDATE', phase: event.phase };
                    break;
                case 'STREAM_CHUNK':
                    yield { type: 'STREAM_CHUNK', text: event.text };
                    break;
                case 'SUBMISSION_COMPLETE': // Mapped from RESULT if necessary
                    yield { type: 'SUBMISSION_COMPLETE', submission: event.submission };
                    break;
                case 'ERROR':
                    yield { type: 'ERROR', message: event.message };
                    break;
                case 'FOLLOW_UP':
                    yield { type: 'FOLLOW_UP', text: event.text };
                    break;
                case 'TASK_COMPLETE':
                    yield { type: 'TASK_COMPLETE' };
                    break;
            }
        }
    } catch (e) {
        console.error("Gateway Error:", e);
        yield { type: 'ERROR', message: "Service Gateway Error." };
    }
  }

  resetSession() {
      // Handled by Engine statelessly
  }
}

export const orchestratorService = new OrchestratorService();