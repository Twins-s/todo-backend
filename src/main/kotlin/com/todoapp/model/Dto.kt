package com.todoapp.model

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

// ── Запрос на создание задачи (тело POST-запроса) ─────────────────────────
data class CreateTodoRequest(
    @field:NotBlank(message = "Название не может быть пустым")
    @field:Size(max = 255, message = "Слишком длинное название")
    val title: String,

    val completed: Boolean = false
)

// ── Запрос на обновление задачи (тело PUT-запроса) ────────────────────────
data class UpdateTodoRequest(
    @field:NotBlank(message = "Название не может быть пустым")
    @field:Size(max = 255, message = "Слишком длинное название")
    val title: String,

    val completed: Boolean
)

// ── Частичное обновление — только статус (тело PATCH-запроса) ────────────
data class PatchTodoRequest(
    val completed: Boolean
)

// ── Ответ сервера (то, что получает React) ────────────────────────────────
data class TodoResponse(
    val id: Long,
    val title: String,
    val completed: Boolean,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime
)

// ── Конвертер: Entity → Response ──────────────────────────────────────────
fun Todo.toResponse() = TodoResponse(
    id        = id,
    title     = title,
    completed = completed,
    createdAt = createdAt,
    updatedAt = updatedAt
)
