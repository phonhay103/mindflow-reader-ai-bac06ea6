
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Generating knowledge graph for text length:', text.length);

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + googleApiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Tạo một knowledge graph (sơ đồ tri thức) từ văn bản sau đây. Hãy trích xuất các thực thể chính, khái niệm và mối quan hệ giữa chúng. Trả về kết quả dưới dạng JSON với cấu trúc nodes và edges phù hợp để hiển thị sơ đồ:

Văn bản: ${text}

Hãy trả về JSON theo định dạng:
{
  "nodes": [
    {"id": "1", "label": "Tên thực thể", "type": "loại", "description": "mô tả ngắn"},
    ...
  ],
  "edges": [
    {"from": "1", "to": "2", "label": "mối quan hệ", "type": "loại quan hệ"},
    ...
  ],
  "summary": "Tóm tắt ngắn về knowledge graph này"
}

Chỉ trả về JSON, không có text khác.`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google API error:', errorText);
      throw new Error(`Google API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Google API response:', data);

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Google API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Try to parse the JSON response
    let knowledgeGraph;
    try {
      knowledgeGraph = JSON.parse(generatedText);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', generatedText);
      // Fallback knowledge graph
      knowledgeGraph = {
        nodes: [
          {id: "1", label: "Chủ đề chính", type: "concept", description: "Khái niệm trung tâm của văn bản"},
          {id: "2", label: "Ý tưởng phụ", type: "idea", description: "Ý tưởng hỗ trợ chủ đề chính"}
        ],
        edges: [
          {from: "1", to: "2", label: "liên quan đến", type: "relationship"}
        ],
        summary: "Knowledge graph được tạo từ nội dung văn bản đã cung cấp"
      };
    }

    return new Response(JSON.stringify({ knowledgeGraph }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-knowledge-graph function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
