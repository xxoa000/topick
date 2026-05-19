package com.lch.topick.web.filter.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lch.topick.web.filter.entity.Tag;
import com.lch.topick.web.filter.repository.TagRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<Tag> getActiveTag() {
        return tagRepository.findByTagStatus("active");
    }
}