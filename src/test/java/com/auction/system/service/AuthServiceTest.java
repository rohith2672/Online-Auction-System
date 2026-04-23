package com.auction.system.service;

import com.auction.system.dto.AuthRequest;
import com.auction.system.dto.AuthResponse;
import com.auction.system.dto.RegisterRequest;
import com.auction.system.model.User;
import com.auction.system.repository.UserRepository;
import com.auction.system.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private UserDetailsService userDetailsService;

    @InjectMocks private AuthService authService;

    private UserDetails mockUserDetails;

    @BeforeEach
    void setUp() {
        mockUserDetails = org.springframework.security.core.userdetails.User
                .withUsername("testuser")
                .password("encoded")
                .authorities(Collections.emptyList())
                .build();
    }

    // ── register ─────────────────────────────────────────────────────────────

    @Test
    void register_success_returnsTokenAndRole() {
        RegisterRequest req = RegisterRequest.builder()
                .username("testuser")
                .password("pass123")
                .email("test@example.com")
                .role(User.Role.USER)
                .build();

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass123")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(mockUserDetails);
        when(jwtService.generateToken(mockUserDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.register(req);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getRole()).isEqualTo(User.Role.USER);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateUsername_throwsException() {
        RegisterRequest req = RegisterRequest.builder()
                .username("existing")
                .password("pass")
                .email("new@example.com")
                .role(User.Role.USER)
                .build();

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Username already exists");
    }

    @Test
    void register_duplicateEmail_throwsException() {
        RegisterRequest req = RegisterRequest.builder()
                .username("newuser")
                .password("pass")
                .email("dup@example.com")
                .role(User.Role.USER)
                .build();

        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("dup@example.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email already exists");
    }

    // ── authenticate ──────────────────────────────────────────────────────────

    @Test
    void authenticate_success_returnsTokenAndRole() {
        AuthRequest req = new AuthRequest("testuser", "pass123");

        User user = User.builder()
                .id(UUID.randomUUID())
                .username("testuser")
                .password("encoded")
                .email("test@example.com")
                .role(User.Role.SELLER)
                .credits(BigDecimal.ZERO)
                .build();

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(mockUserDetails);
        when(jwtService.generateToken(mockUserDetails)).thenReturn("jwt-token");

        AuthResponse response = authService.authenticate(req);

        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getRole()).isEqualTo(User.Role.SELLER);
        verify(authenticationManager).authenticate(
                new UsernamePasswordAuthenticationToken("testuser", "pass123"));
    }

    @Test
    void authenticate_userNotFound_throwsException() {
        AuthRequest req = new AuthRequest("ghost", "pass");
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.authenticate(req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User not found");
    }
}
