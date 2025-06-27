"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const visionService_1 = require("../dist/src/services/visionService");
async function testRecipeIntro() {
    const recipe = {
        id: '1',
        title: 'Test Recipe',
        required_cookware: ['oven', 'large pot'],
    };
    const detectedTools = ['large pot', 'knife'];
    console.log('Testing with missing tool...');
    let intro = await visionService_1.visionService.generateRecipeIntro(recipe, detectedTools);
    console.log('Intro:', intro);
    const detectedTools2 = ['large pot', 'knife', 'oven'];
    console.log('\nTesting with all tools...');
    intro = await visionService_1.visionService.generateRecipeIntro(recipe, detectedTools2);
    console.log('Intro:', intro);
}
testRecipeIntro();
