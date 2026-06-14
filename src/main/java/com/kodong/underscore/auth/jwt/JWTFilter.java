package com.kodong.underscore.auth.jwt;

import com.kodong.underscore.auth.dto.CustomOAuth2User;
import com.kodong.underscore.auth.dto.UserDTO;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String accessToken = request.getHeader("access");

        //토큰이 없으면 다음 필터로 넘김
        if(accessToken == null){
            filterChain.doFilter(request,response);
            return;
        }

        //토큰 만료 여부 확인, 만료 시 다음 필터로 넘기지 않음
        try{
            jwtUtil.isExpired(accessToken);
        }catch(ExpiredJwtException e){

            //response body
            PrintWriter printWriter = response.getWriter();
            printWriter.print("access token expired");

            //response status code
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        //토큰이 access인지 refresh인지 확인
        String category = jwtUtil.getCategory(accessToken);

        if(!category.equals("access")){

            PrintWriter printWriter = response.getWriter();
            printWriter.print("invalid access token");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        //username, role 값을 획득
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        //userDTO를 생성하여 값 SET
        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(username);
        userDTO.setRole(role);

        CustomOAuth2User customOAuth2User = new CustomOAuth2User(userDTO);

        //스프링 시큐리티 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customOAuth2User,null,customOAuth2User.getAuthorities());

        //세션에 사용자 등록
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request,response);


//        String authorization = null;
//        Cookie[] cookies = request.getCookies();
//
//        for(Cookie cookie : cookies){
//
//            if(cookie.getName().equals("Authorization")){
//                authorization = cookie.getValue();
//            }
//        }


//        //Authorization 헤더 검증
//        if(authorization == null){
//            System.out.println("token null");
//            filterChain.doFilter(request,response);
//
//            //조건이 해당되면 메소드 종료(필수)
//            return;
//        }
//
//        //토큰
//        String token = authorization;

//        if(jwtUtil.isExpired(token)){
//            System.out.println("token expired");
//            filterChain.doFilter(request,response);
//
//            //조건이 해당되면 메소드 종료
//            return;
//        }





    }
}
