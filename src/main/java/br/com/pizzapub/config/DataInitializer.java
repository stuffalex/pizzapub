package br.com.pizzapub.config;

import br.com.pizzapub.domain.PerfilUsuario;
import br.com.pizzapub.domain.Usuario;
import br.com.pizzapub.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Inicializador de dados executado na inicialização da aplicação.
 *
 * <p>Verifica se o usuário administrador padrão existe e, caso contrário, o cria.
 * Este componente garante que sempre haverá um ponto de entrada para o sistema
 * mesmo em uma instalação limpa (banco zerado).</p>
 *
 * <p><strong>Credenciais padrão do admin</strong>:
 * <ul>
 *   <li>Email: {@code admin@pizzapub.com}</li>
 *   <li>Senha: {@code admin123}</li>
 * </ul>
 * ⚠️ Altere a senha após o primeiro login em produção!</p>
 *
 * @see br.com.pizzapub.domain.Usuario
 * @see br.com.pizzapub.domain.PerfilUsuario
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        criarAdminSeNaoExistir();
    }

    /**
     * Cria o usuário admin padrão se o email {@code admin@pizzapub.com}
     * ainda não estiver cadastrado no banco.
     */
    private void criarAdminSeNaoExistir() {
        final String adminEmail = "admin@pizzapub.com";

        if (usuarioRepository.findByEmail(adminEmail).isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador PizzaPub");
            admin.setEmail(adminEmail);
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setPerfil(PerfilUsuario.ADMIN);

            usuarioRepository.save(admin);

            System.out.println("=========================================");
            System.out.println(">>> Usuário admin criado com sucesso!");
            System.out.println(">>> Email : admin@pizzapub.com");
            System.out.println(">>> Senha : admin123");
            System.out.println(">>> ⚠️  Altere a senha em produção!");
            System.out.println("=========================================");
        }
    }
}
