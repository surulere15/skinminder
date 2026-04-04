import Anthropic from "@anthropic-ai/sdk";
import { ProductComparisonSchema, ProductComparison } from "@/schemas/comparison";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function compareProducts(productA: any, productB: any): Promise<ProductComparison> {
  const prompt = `
You are the SkinMinder Cosmetic Formulation Expert.
Compare these two products for synergy and safety collisions when used in the same routine.

Product A: ${productA.name}
Ingredients A: ${productA.ingredients_list}

Product B: ${productB.name}
Ingredients B: ${productB.ingredients_list}

RULES:
- Identify if they have clashing active ingredients (e.g., Vitamin C + Copper Peptides, or dual Exfoliants).
- Calculate a synergy score (100 = perfect match, 0 = dangerous collision).
- Extract combined benefits.
- Provide a clear usage recommendation (e.g., 'Use Product A in AM, Product B in PM').

Return only valid JSON matching the schema.
`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 1500,
    messages: [
      { role: "user", content: prompt }
    ],
    system: "You are a professional cosmetic chemist. Return valid JSON.",
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';
  return ProductComparisonSchema.parse(JSON.parse(content));
}
