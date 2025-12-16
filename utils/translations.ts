import { Language } from '../types';

export const translations = {
  [Language.EN]: {
    // Auth / Login
    welcome_back: "Welcome Back",
    create_account: "Create Account",
    sign_in_desc: "Sign in to Magnetic Blogs to supercharge your content.",
    join_desc: "Join Magnetic Blogs to start generating ideas.",
    full_name: "Full Name",
    company_business: "Company / Business",
    email_address: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    sign_in_btn: "Sign In",
    processing: "Processing...",
    create_account_btn: "Create Account",
    already_have_account: "Already have an account?",
    dont_have_account: "Don't have an account?",
    register_now: "Register now",
    login_link: "Login",
    alert_pass_mismatch: "Passwords do not match",
    alert_fill_all: "Please fill in all fields",
    placeholder_name: "John Doe",
    placeholder_company: "Acme Inc.",
    
    // Layout / Sidebar
    nav_generator: "Generator",
    nav_history: "History",
    nav_integrations: "Integrations",
    nav_profile: "Profile",
    nav_admin: "Admin",
    logout: "Logout",

    // Dashboard
    gen_title: "Generate Ideas",
    gen_subtitle: "Enter your niche to get high-converting blog post concepts powered by AI.",
    input_placeholder: "Ex: Digital Marketing for Dentists, Crypto Trends...",
    btn_analyze: "Analyzing...",
    btn_generate: "Generate",
    generated_concepts: "Generated Concepts",
    btn_add_custom: "Add Custom",
    btn_send_selected: "Send Selected",
    btn_export: "Export CSV",
    sending: "Sending...",
    sent_tag: "Sent",
    notification_gen_fail: "Failed to generate ideas. Try again.",
    notification_send_success: "Successfully sent {n} ideas!",
    notification_send_fail: "Failed to send to Webhook. Check your settings.",
    
    // History
    history_title: "History",
    search_placeholder: "Search topic or title...",
    table_date: "Date",
    table_topic: "Topic",
    table_idea: "Idea",
    table_status: "Status",
    table_actions: "Actions",
    no_history: "No sent ideas found.",
    btn_resend: "Resend",
    resend_success: "Resent successfully!",
    resend_fail: "Failed to resend.",

    // Settings
    integrations_title: "Integrations",
    webhook_title: "n8n / Webhook Integration",
    webhook_desc: "Configure the endpoint where Magnetic Blogs will send your generated article ideas. The payload will include the title, description, and your user metadata.",
    webhook_label: "Webhook URL",
    save_config: "Save Configuration",
    test_connection: "Test Connection",
    testing: "Testing...",
    test_success: "Connection successful! Webhook returned 200 OK.",
    test_fail: "Webhook failed with status: {status}",
    test_error: "Connection error: {error}",
    settings_saved: "Settings saved!",

    // Blog Validation
    blog_title: "Blog Validation",
    blog_subtitle: "Verify published articles",
    blog_desc: "Enter your blog URL to verify if new articles have been published.",
    blog_url_label: "Blog URL",
    blog_url_placeholder: "https://your-blog.com",

    // Profile
    profile_title: "Profile",
    change_avatar: "Change Avatar",
    label_fullname: "Full Name",
    label_company: "Company Name",
    label_email: "Email (Read Only)",
    label_phone: "Phone Number",
    label_bio: "Company Biography",
    save_changes: "Save Changes",
    profile_updated: "Profile updated!",
    
    // Profile Sections
    section_personal: "Personal Info",
    section_company: "Company Details",
    section_socials: "Social Media",
    section_security: "Security",
    section_visuals: "Visuals",

    // Socials
    social_insta: "Instagram",
    social_fb: "Facebook",
    social_li: "LinkedIn",
    social_yt: "YouTube",
    social_site: "Website",

    // Visuals
    label_logo: "Company Logo",
    label_avatar: "User Avatar",
    btn_upload: "Upload Image",

    // Security
    current_pass: "Current Password",
    new_pass: "New Password",
    confirm_new_pass: "Confirm New Password",
    btn_update_pass: "Update Password",
    pass_updated: "Password updated successfully",

    // Admin
    admin_title: "Admin Dashboard",
    admin_users_list: "User Management",
    admin_stats: "System Statistics",
    col_user: "User",
    col_role: "Role",
    col_status: "Status",
    col_actions: "Actions",
    status_active: "Active",
    status_inactive: "Inactive",
    btn_deactivate: "Deactivate",
    btn_activate: "Activate"
  },
  [Language.PT_BR]: {
    // Auth / Login
    welcome_back: "Bem-vindo de volta",
    create_account: "Criar Conta",
    sign_in_desc: "Entre no Magnetic Blogs para turbinar seu conteúdo.",
    join_desc: "Junte-se ao Magnetic Blogs para começar a gerar ideias.",
    full_name: "Nome Completo",
    company_business: "Empresa / Negócio",
    email_address: "Endereço de E-mail",
    password: "Senha",
    confirm_password: "Confirmar Senha",
    sign_in_btn: "Entrar",
    processing: "Processando...",
    create_account_btn: "Criar Conta",
    already_have_account: "Já tem uma conta?",
    dont_have_account: "Não tem uma conta?",
    register_now: "Cadastre-se agora",
    login_link: "Entrar",
    alert_pass_mismatch: "As senhas não coincidem",
    alert_fill_all: "Por favor, preencha todos os campos",
    placeholder_name: "João Silva",
    placeholder_company: "Empresa Ltda.",

    // Layout / Sidebar
    nav_generator: "Gerador",
    nav_history: "Histórico",
    nav_integrations: "Integrações",
    nav_profile: "Perfil",
    nav_admin: "Admin",
    logout: "Sair",

    // Dashboard
    gen_title: "Gerar Ideias",
    gen_subtitle: "Informe seu nicho para obter conceitos de artigos de alta conversão gerados por IA.",
    input_placeholder: "Ex: Marketing Digital para Dentistas, Tendências Cripto...",
    btn_analyze: "Analisando...",
    btn_generate: "Gerar",
    generated_concepts: "Conceitos Gerados",
    btn_add_custom: "Adicionar Manual",
    btn_send_selected: "Enviar Selecionados",
    btn_export: "Exportar CSV",
    sending: "Enviando...",
    sent_tag: "Enviado",
    notification_gen_fail: "Falha ao gerar ideias. Tente novamente.",
    notification_send_success: "Sucesso ao enviar {n} ideias!",
    notification_send_fail: "Falha ao enviar para o Webhook. Verifique suas configurações.",

    // History
    history_title: "Histórico",
    search_placeholder: "Buscar tema ou título...",
    table_date: "Data",
    table_topic: "Tema",
    table_idea: "Ideia",
    table_status: "Status",
    table_actions: "Ações",
    no_history: "Nenhuma ideia enviada encontrada.",
    btn_resend: "Reenviar",
    resend_success: "Reenviado com sucesso!",
    resend_fail: "Falha ao reenviar.",

    // Settings
    integrations_title: "Integrações",
    webhook_title: "Integração n8n / Webhook",
    webhook_desc: "Configure o endpoint para onde o Magnetic Blogs enviará suas ideias de artigos geradas. O payload incluirá o título, descrição e metadados do usuário.",
    webhook_label: "URL do Webhook",
    save_config: "Salvar Configuração",
    test_connection: "Testar Conexão",
    testing: "Testando...",
    test_success: "Conexão bem-sucedida! Webhook retornou 200 OK.",
    test_fail: "Webhook falhou com status: {status}",
    test_error: "Erro de conexão: {error}",
    settings_saved: "Configurações salvas!",

    // Blog Validation
    blog_title: "Validação do Blog",
    blog_subtitle: "Verificar artigos publicados",
    blog_desc: "Insira a URL do seu blog para verificar se novos artigos foram publicados.",
    blog_url_label: "URL do Blog",
    blog_url_placeholder: "https://seu-blog.com",

    // Profile
    profile_title: "Perfil",
    change_avatar: "Alterar Avatar",
    label_fullname: "Nome Completo",
    label_company: "Nome da Empresa",
    label_email: "E-mail (Somente Leitura)",
    label_phone: "Telefone",
    label_bio: "Biografia da Empresa",
    save_changes: "Salvar Alterações",
    profile_updated: "Perfil atualizado!",

    // Profile Sections
    section_personal: "Dados Pessoais",
    section_company: "Dados da Empresa",
    section_socials: "Redes Sociais",
    section_security: "Segurança",
    section_visuals: "Visuais",

    // Socials
    social_insta: "Instagram",
    social_fb: "Facebook",
    social_li: "LinkedIn",
    social_yt: "YouTube",
    social_site: "Site",

    // Visuals
    label_logo: "Logo da Empresa",
    label_avatar: "Avatar do Usuário",
    btn_upload: "Carregar Imagem",

    // Security
    current_pass: "Senha Atual",
    new_pass: "Nova Senha",
    confirm_new_pass: "Confirmar Nova Senha",
    btn_update_pass: "Atualizar Senha",
    pass_updated: "Senha atualizada com sucesso",

    // Admin
    admin_title: "Painel Admin",
    admin_users_list: "Gestão de Usuários",
    admin_stats: "Estatísticas do Sistema",
    col_user: "Usuário",
    col_role: "Perfil",
    col_status: "Status",
    col_actions: "Ações",
    status_active: "Ativo",
    status_inactive: "Inativo",
    btn_deactivate: "Desativar",
    btn_activate: "Ativar"
  },
  [Language.ES]: {
    // Auth / Login
    welcome_back: "Bienvenido de nuevo",
    create_account: "Crear Cuenta",
    sign_in_desc: "Inicia sesión en Magnetic Blogs para potenciar tu contenido.",
    join_desc: "Únete a Magnetic Blogs para comenzar a generar ideas.",
    full_name: "Nombre Completo",
    company_business: "Empresa / Negocio",
    email_address: "Correo Electrónico",
    password: "Contraseña",
    confirm_password: "Confirmar Contraseña",
    sign_in_btn: "Iniciar Sesión",
    processing: "Procesando...",
    create_account_btn: "Crear Cuenta",
    already_have_account: "¿Ya tienes una cuenta?",
    dont_have_account: "¿No tienes una cuenta?",
    register_now: "Regístrate ahora",
    login_link: "Iniciar sesión",
    alert_pass_mismatch: "Las contraseñas no coinciden",
    alert_fill_all: "Por favor, completa todos los campos",
    placeholder_name: "Juan Pérez",
    placeholder_company: "Empresa S.A.",

    // Layout / Sidebar
    nav_generator: "Generador",
    nav_history: "Historial",
    nav_integrations: "Integraciones",
    nav_profile: "Perfil",
    nav_admin: "Admin",
    logout: "Cerrar Sesión",

    // Dashboard
    gen_title: "Generar Ideas",
    gen_subtitle: "Introduce tu nicho para obtener conceptos de artículos de blog de alta conversión con IA.",
    input_placeholder: "Ej: Marketing Digital para Dentistas, Tendencias Cripto...",
    btn_analyze: "Analizando...",
    btn_generate: "Generar",
    generated_concepts: "Conceptos Generados",
    btn_add_custom: "Añadir Manual",
    btn_send_selected: "Enviar Seleccionados",
    btn_export: "Exportar CSV",
    sending: "Enviando...",
    sent_tag: "Enviado",
    notification_gen_fail: "Error al generar ideas. Inténtalo de nuevo.",
    notification_send_success: "¡Éxito al enviar {n} ideas!",
    notification_send_fail: "Error al enviar al Webhook. Revisa tu configuración.",

    // History
    history_title: "Historial",
    search_placeholder: "Buscar tema o título...",
    table_date: "Fecha",
    table_topic: "Tema",
    table_idea: "Idea",
    table_status: "Estado",
    table_actions: "Acciones",
    no_history: "No se encontraron ideas enviadas.",
    btn_resend: "Reenviar",
    resend_success: "¡Reenviado con éxito!",
    resend_fail: "Error al reenviar.",

    // Settings
    integrations_title: "Integraciones",
    webhook_title: "Integración n8n / Webhook",
    webhook_desc: "Configura el endpoint donde Magnetic Blogs enviará tus ideas generadas. La carga útil incluirá título, descripción y metadatos de usuario.",
    webhook_label: "URL del Webhook",
    save_config: "Guardar Configuración",
    test_connection: "Probar Conexión",
    testing: "Probando...",
    test_success: "¡Conexión exitosa! Webhook devolvió 200 OK.",
    test_fail: "Webhook falló con estado: {status}",
    test_error: "Error de conexión: {error}",
    settings_saved: "¡Configuración guardada!",

    // Blog Validation
    blog_title: "Validación del Blog",
    blog_subtitle: "Verificar artículos publicados",
    blog_desc: "Introduce la URL de tu blog para verificar si se han publicado nuevos artículos.",
    blog_url_label: "URL del Blog",
    blog_url_placeholder: "https://tu-blog.com",

    // Profile
    profile_title: "Perfil",
    change_avatar: "Cambiar Avatar",
    label_fullname: "Nombre Completo",
    label_company: "Nombre de la Empresa",
    label_email: "Correo (Solo Lectura)",
    label_phone: "Teléfono",
    label_bio: "Biografía de la Empresa",
    save_changes: "Guardar Cambios",
    profile_updated: "¡Perfil actualizado!",

    // Profile Sections
    section_personal: "Información Personal",
    section_company: "Detalles de la Empresa",
    section_socials: "Redes Sociales",
    section_security: "Seguridad",
    section_visuals: "Visuales",

    // Socials
    social_insta: "Instagram",
    social_fb: "Facebook",
    social_li: "LinkedIn",
    social_yt: "YouTube",
    social_site: "Sitio Web",

    // Visuals
    label_logo: "Logotipo de la Empresa",
    label_avatar: "Avatar de Usuario",
    btn_upload: "Subir Imagen",

    // Security
    current_pass: "Contraseña Actual",
    new_pass: "Nueva Contraseña",
    confirm_new_pass: "Confirmar Nueva Contraseña",
    btn_update_pass: "Actualizar Contraseña",
    pass_updated: "Contraseña actualizada con éxito",

    // Admin
    admin_title: "Panel de Admin",
    admin_users_list: "Gestión de Usuarios",
    admin_stats: "Estadísticas del Sistema",
    col_user: "Usuario",
    col_role: "Rol",
    col_status: "Estado",
    col_actions: "Acciones",
    status_active: "Activo",
    status_inactive: "Inactivo",
    btn_deactivate: "Desactivar",
    btn_activate: "Activar"
  }
};
