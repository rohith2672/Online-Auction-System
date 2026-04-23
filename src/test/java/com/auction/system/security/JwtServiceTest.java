package com.auction.system.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey",
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 86400000L);
    }

    private UserDetails userDetails(String username) {
        return User.withUsername(username)
                .password("password")
                .authorities(Collections.emptyList())
                .build();
    }

    @Test
    void generateToken_returnsNonNullToken() {
        String token = jwtService.generateToken(userDetails("alice"));
        assertThat(token).isNotBlank();
    }

    @Test
    void extractUsername_returnsCorrectUsername() {
        UserDetails ud = userDetails("alice");
        String token = jwtService.generateToken(ud);
        assertThat(jwtService.extractUsername(token)).isEqualTo("alice");
    }

    @Test
    void isTokenValid_validToken_returnsTrue() {
        UserDetails ud = userDetails("bob");
        String token = jwtService.generateToken(ud);
        assertThat(jwtService.isTokenValid(token, ud)).isTrue();
    }

    @Test
    void isTokenValid_wrongUser_returnsFalse() {
        String token = jwtService.generateToken(userDetails("alice"));
        assertThat(jwtService.isTokenValid(token, userDetails("bob"))).isFalse();
    }

    @Test
    void isTokenValid_expiredToken_throwsExpiredJwtException() {
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", -1000L);
        UserDetails ud = userDetails("charlie");
        String token = jwtService.generateToken(ud);
        // jjwt throws ExpiredJwtException during claim parsing; the service propagates it
        org.assertj.core.api.Assertions.assertThatThrownBy(() -> jwtService.isTokenValid(token, ud))
                .isInstanceOf(io.jsonwebtoken.ExpiredJwtException.class);
    }
}
