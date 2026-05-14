package com.lch.topick.web.client.def.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.client.def.domain.ClientRequestDTO;
import com.lch.topick.web.client.def.entity.Client;
import com.lch.topick.web.client.def.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

	private final ClientService clientService;
	// private final PasswordEncoder passwordEncoder;

	@GetMapping("/list")
	public ResponseEntity<?> selectList() {
		List<Client> list = clientService.selectList();

		if (list != null && list.size() > 0)
			return ResponseEntity.status(HttpStatus.OK).body(list);
		else
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("다시 시도해 주세요.");
	}// selectList()

	@GetMapping("/{clientId}")
	public ResponseEntity<?> selectOne(@PathVariable String clientId) {
		Client one = clientService.selectOne(clientId);

		if (one != null)
			return ResponseEntity.status(HttpStatus.OK).body(one);
		else
			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("데이터가 존재하지 않습니다.");
	}// selectOne()

//	@PostMapping("/login")
//	public ResponseEntity<?> login(@RequestBody Client entity) {
//		Optional<Client> one = clientService.selectOne(entity.getClientId());
//
//		if ( client != null && passwordEncoder.matches(entity.getClientPw()) ) {
//			return ResponseEntity.status(HttpStatus.OK).body(client);
//		} else {
//			return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body("다시 시도해 주세요.");
//		}
//	}// login()
	
	

	@PostMapping("/join")
	public ResponseEntity<?> join(@RequestBody ClientRequestDTO dto) {
		Client one = clientService.insert(dto);

		if (one != null)
			return ResponseEntity.status(HttpStatus.OK).body(one);
		else
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("데이터가 존재하지 않습니다.");
	}// join()

	
	
	/* 기존 계정 수정 */
	@PatchMapping("/update/{clientId}")
	public ResponseEntity<?> update(@PathVariable String clientId, @RequestBody ClientRequestDTO dto) {

		Client one = clientService.update(clientId, dto);
		return ResponseEntity.ok(one);
	}

	/* 계정 삭제 */
	@DeleteMapping("/delete/{clientId}")
	public void delete(@PathVariable String clientId, Client entity) {

	}// delete()

}// class
