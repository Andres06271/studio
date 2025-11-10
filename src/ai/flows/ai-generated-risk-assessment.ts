'use server';

/**
 * @fileOverview An AI tool that analyzes project descriptions and historical incident data to identify potential risks.
 *
 * - aiGeneratedRiskAssessment - A function that generates a risk assessment for a given project.
 * - AIGeneratedRiskAssessmentInput - The input type for the aiGeneratedRiskAssessment function.
 * - AIGeneratedRiskAssessmentOutput - The return type for the aiGeneratedRiskAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIGeneratedRiskAssessmentInputSchema = z.object({
  projectDescription: z
    .string()
    .describe('The description of the project to assess risks for.'),
  historicalIncidentData: z
    .string()
    .describe('Historical incident data to inform the risk assessment.'),
  projectTimeline: z.string().describe('The timeline of the project.'),
  engineeringPersonnel: z.string().describe('The engineering personnel involved in the project.'),
});
export type AIGeneratedRiskAssessmentInput = z.infer<
  typeof AIGeneratedRiskAssessmentInputSchema
>;

const AIGeneratedRiskAssessmentOutputSchema = z.object({
  identifiedRisks: z
    .string()
    .describe('A list of potential risks identified for the project.'),
  riskMitigationStrategies: z
    .string()
    .describe('Strategies to mitigate the identified risks.'),
});
export type AIGeneratedRiskAssessmentOutput = z.infer<
  typeof AIGeneratedRiskAssessmentOutputSchema
>;

export async function aiGeneratedRiskAssessment(
  input: AIGeneratedRiskAssessmentInput
): Promise<AIGeneratedRiskAssessmentOutput> {
  return aiGeneratedRiskAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiGeneratedRiskAssessmentPrompt',
  input: {schema: AIGeneratedRiskAssessmentInputSchema},
  output: {schema: AIGeneratedRiskAssessmentOutputSchema},
  prompt: `You are an expert risk assessment engineer.

You will analyze the project description, historical incident data, project timeline, and engineering personnel involved to identify potential risks and suggest mitigation strategies.

Project Description: {{{projectDescription}}}
Historical Incident Data: {{{historicalIncidentData}}}
Project Timeline: {{{projectTimeline}}}
Engineering Personnel: {{{engineeringPersonnel}}}

Based on the above information, identify potential risks and suggest mitigation strategies.
`,
});

const aiGeneratedRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'aiGeneratedRiskAssessmentFlow',
    inputSchema: AIGeneratedRiskAssessmentInputSchema,
    outputSchema: AIGeneratedRiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
