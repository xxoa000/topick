package com.lch.topick.web.client.def.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.client.def.service.ClientService;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {
	
	private final ClientService clientService;
	private final PasswordEncoder passwordEncoder;
	
	@GetMapping("/list")
	public ResponseEntity<?> clientList() {
		return null;
	}//clientList()
	
	
	@PostMapping("/join")
	public ResponseEntity<?> join() {
		return null;
	}//join()
	

	
	@PostMapping("/login")
	public ResponseEntity<?> login() {
		return null;
	}//login()
	
	
	@PutMapping("/update/{clientNo}")
	public ResponseEntity<?> update() {
		return null;
	}//update()
	
	@DeleteMapping("/delete/{clientNo}")
	public ResponseEntity<?> delete() {
		return null;
	}//delete()
	
	
	
}//class
