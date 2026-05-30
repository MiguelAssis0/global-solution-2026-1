package com.araterra.demo.auth.internal.services;

import com.araterra.demo.auth.internal.entities.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PasswordResetEmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.from:no-reply@araterra.local}")
    private String from;

    public void sendPasswordResetEmail(User user, String resetLink) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();

        if (mailSender == null) {
            log.warn("Password reset email was not sent because no mail sender is configured.");
            return;
        }

        String firstName = user.getFirstName() == null || user.getFirstName().isBlank()
                ? "usuario"
                : user.getFirstName();

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(user.getEmail());
        message.setSubject("Redefinicao de senha - Araterra");
        message.setText("""
                Ola, %s.

                Recebemos uma solicitacao para redefinir sua senha na Araterra.
                Acesse o link abaixo para criar uma nova senha:

                %s

                Se voce nao solicitou essa alteracao, ignore este e-mail.
                """.formatted(firstName, resetLink));

        try {
            mailSender.send(message);
        } catch (MailException exception) {
            log.warn("Password reset email could not be sent to {}.", user.getEmail(), exception);
        }
    }
}
