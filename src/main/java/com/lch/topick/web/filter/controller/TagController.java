package com.lch.topick.web.filter.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lch.topick.web.filter.entity.Tag;
import com.lch.topick.web.filter.service.TagService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tag")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<Tag> list() {
        return tagService.getActiveTag();
    }
}
