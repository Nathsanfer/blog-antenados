// supabase/functions/manage-users/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

// Configuração de CORS para permitir requisições do seu front-end Vue
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Lida com o preflight request do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Cria o cliente do Supabase com privilégios de Admin (Service Role)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 2. Extrai os dados da requisição enviada pelo Vue
    const { action, user } = await req.json()

    // --- AÇÃO: CRIAR USUÁRIO ---
    if (action === 'create') {
      // Cria o usuário no Auth (a sua Trigger handle_new_user cuidará de inserir na tabela public.users)
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Pula a verificação de email
        user_metadata: {
          name: user.name,
          position: user.position
        }
      })

      if (error) throw error
      
      return new Response(
        JSON.stringify({ message: 'Usuário criado com sucesso', data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    // --- AÇÃO: EXCLUIR USUÁRIO ---
    if (action === 'delete') {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)
      
      if (error) throw error

      return new Response(
        JSON.stringify({ message: 'Usuário excluído com sucesso' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    }

    throw new Error('Ação inválida')

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})