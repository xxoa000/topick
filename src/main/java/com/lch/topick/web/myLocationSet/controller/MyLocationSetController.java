package com.lch.topick.web.myLocationSet.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.myLocationSet.domain.MyLocationSetDTO;
import com.lch.topick.web.myLocationSet.entity.MyLocationSet;
import com.lch.topick.web.myLocationSet.service.MyLocationSetService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequestMapping("/api/myLocationSet")
@RequiredArgsConstructor	
@Log4j2
public class MyLocationSetController {

	private final MyLocationSetService myLocationSetService;
	
	@PostMapping("/join")
    public ResponseEntity<?> join(HttpServletRequest request, @RequestBody MyLocationSetDTO dto) 
                                            throws IOException {
        try {
            //  USER Role 추가후
            //=> save 전에 USER Role 추가
            //=> 추후, 조건에 따라 Role 추가하면됨
            //entity.addRole(MemberRole.USER); 
            //=> save

        	MyLocationSet entity = MyLocationSet.builder()
            .memberId(dto.getMemberId())
            .addressPostcode(dto.getAddressPostcode())
            .addressRoad(dto.getAddressRoad())
            .addressLot(dto.getAddressLot())
            .addressDetail(dto.getAddressDetail())
            .addressName(dto.getAddressName())
            .addressX(dto.getAddressX())
            .addressY(dto.getAddressY())
            .build();
        	
            log.info(" MyLocationSet Insert 성공 => "+ myLocationSetService.save(entity));
            return ResponseEntity.ok("등록 성공");
        } catch (Exception e) {
            log.error("** 등록 실패 => "+ e.toString());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("등록실패: "+e.toString());
        }
    } //join
	
	
	
}
