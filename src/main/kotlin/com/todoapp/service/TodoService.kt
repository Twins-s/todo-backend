package com.todoapp.service

import com.todoapp.model.*
import com.todoapp.repository.TodoRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.server.ResponseStatusException

@Service
@Transactional
class TodoService(
    // Spring сам передаёт репозиторий через конструктор (Dependency Injection)
    private val repo: TodoRepository
) {

    // ── Получить все задачи ───────────────────────────────────────────────
    @Transactional(readOnly = true)
    fun getAll(): List<TodoResponse> =
        repo.findAll().map { it.toResponse() }

    // ── Получить одну задачу по ID ────────────────────────────────────────
    @Transactional(readOnly = true)
    fun getById(id: Long): TodoResponse =
        findOrThrow(id).toResponse()

    // ── Создать новую задачу ──────────────────────────────────────────────
    fun create(request: CreateTodoRequest): TodoResponse {
        val todo = Todo(
            title     = request.title.trim(),
            completed = request.completed
        )
        return repo.save(todo).toResponse()
    }

    // ── Полностью обновить задачу (PUT) ───────────────────────────────────
    fun update(id: Long, request: UpdateTodoRequest): TodoResponse {
        val todo = findOrThrow(id)
        todo.title     = request.title.trim()
        todo.completed = request.completed
        return repo.save(todo).toResponse()
    }

    // ── Частичное обновление — только статус (PATCH) ──────────────────────
    fun patch(id: Long, request: PatchTodoRequest): TodoResponse {
        val todo = findOrThrow(id)
        todo.completed = request.completed
        return repo.save(todo).toResponse()
    }

    // ── Удалить задачу ────────────────────────────────────────────────────
    fun delete(id: Long) {
        findOrThrow(id)          // убеждаемся, что задача существует
        repo.deleteById(id)
    }

    // ── Удалить все выполненные задачи ────────────────────────────────────
    fun deleteCompleted(): Int {
        val completed = repo.findAllByCompleted(true)
        repo.deleteAll(completed)
        return completed.size
    }

    // ── Вспомогательный метод: найти или вернуть 404 ─────────────────────
    private fun findOrThrow(id: Long): com.todoapp.model.Todo =
        repo.findByIdOrNull(id)
            ?: throw ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Задача с ID $id не найдена"
            )
}
