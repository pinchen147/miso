# RAG System Setup Guide

This guide walks you through setting up the complete RAG (Retrieval-Augmented Generation) system for your Miso AI cooking assistant.

## Prerequisites

1. **Supabase Project** with existing recipe data
2. **OpenAI API Key** for embeddings and chat completions
3. **Google AI (Gemini) API Key** for vision analysis
4. **Node.js** for running setup scripts

## Step 1: Database Setup

1. **Enable pgvector extension in Supabase:**
   ```sql
   -- Run this in your Supabase SQL editor
   -- Copy content from supabase-setup.sql
   ```

2. **Run the setup SQL:**
   - Go to Supabase Dashboard → SQL Editor
   - Copy and paste the content from `supabase-setup.sql`
   - Execute the script

## Step 2: Environment Variables

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in your API keys:**
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_KEY=your_service_key
   EXPO_PUBLIC_OPENAI_API_KEY=your_openai_key
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key
   ```

## Step 3: Generate Embeddings

1. **Install additional dependencies for scripts:**
   ```bash
   npm install dotenv
   ```

2. **Run the embedding generation script:**
   ```bash
   node scripts/generate-embeddings.js
   ```

   This will:
   - Generate embeddings for all recipes without them
   - Generate embeddings for all recipe steps without them
   - Generate embeddings for all ingredients without them

## Step 4: Test the System

1. **Run the RAG test suite:**
   ```bash
   node scripts/test-rag.js
   ```

   This will:
   - Verify database setup
   - Test similarity search functionality
   - Benchmark latency performance
   - Provide optimization recommendations

## Step 5: Start the App

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

## How It Works

### 1 FPS Vision Loop
1. **Camera captures frame** every second (1 FPS)
2. **Gemini analyzes** the frame → objects, actions, cooking state
3. **Query embedding** generated from scene analysis + current step
4. **Vector similarity search** finds relevant recipe steps and ingredients
5. **GPT-4 generates** contextual cooking guidance
6. **Speech synthesis** provides audio guidance to user

### RAG Pipeline Flow
```
Camera Frame → Vision Analysis → Query Embedding → Vector Search → Context Retrieval → LLM Guidance → Speech Output
```

## Performance Optimization

### Latency Targets
- **Total pipeline**: <2 seconds
- **Vision analysis**: <800ms
- **Vector search**: <200ms
- **LLM generation**: <1000ms

### Tuning Parameters

1. **Match Threshold** (0.5-0.9):
   - Lower = more results, less precise
   - Higher = fewer results, more precise
   - Default: 0.7

2. **Max Results** (3-10):
   - More results = richer context, higher latency
   - Fewer results = faster, less context
   - Default: 5

3. **FPS** (0.5-2):
   - Higher = more responsive, higher cost
   - Lower = less responsive, lower cost
   - Default: 1

## Monitoring & Maintenance

### Key Metrics to Track
- Average pipeline latency
- Vision analysis accuracy
- Similarity search relevance
- User engagement with guidance

### Regular Maintenance
1. **Update embeddings** when adding new recipes
2. **Monitor API costs** (OpenAI/Gemini usage)
3. **Tune thresholds** based on user feedback
4. **Optimize database** as data grows

## Troubleshooting

### Common Issues

1. **"pgvector extension not found"**
   - Enable pgvector in Supabase Dashboard → Database → Extensions

2. **"No similar steps found"**
   - Check if embeddings are generated: `SELECT COUNT(*) FROM recipe_steps WHERE embedding IS NOT NULL;`
   - Lower the match_threshold in testing

3. **High latency**
   - Check API response times
   - Consider reducing image quality for vision analysis
   - Optimize vector search parameters

4. **Vision analysis errors**
   - Verify Gemini API key is correct
   - Check image base64 encoding
   - Ensure proper lighting in camera feed

### Debug Tools

1. **Test individual components:**
   ```bash
   node scripts/test-rag.js
   ```

2. **Check embedding generation:**
   ```bash
   node scripts/generate-embeddings.js
   ```

3. **Monitor Supabase logs** in Dashboard → Logs

## Next Steps

1. **User Testing**: Test with real cooking scenarios
2. **Feedback Loop**: Implement user feedback collection
3. **Model Tuning**: Adjust based on usage patterns
4. **Cost Optimization**: Monitor and optimize API usage
5. **Feature Enhancement**: Add ingredient recognition, timer management, etc.

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase and API provider documentation
3. Test individual components using the provided scripts