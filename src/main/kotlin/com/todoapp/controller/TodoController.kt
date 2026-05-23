package com.todoapp.controller

import com.todoapp.model.*
import com.todoapp.service.TodoService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST-контроллер — принимает HTTP-запросы от React и возвращает JSON.
 *
 * @RestController  = @Controller + @ResponseBody (автоматически сериализует в JSON)
 * @RequestMapping  — базовый URL для всех методов этого контроллера
 * @CrossOrigin     — разрешает запросы с React (localhost:3000)
 */
@RestController
@RequestMapping("/todos")
@CrossOrigin(origins = ["http://localhost:3000"])
class TodoController(
    private val service: TodoService
) {

    /**
     * GET /todos
     * Вернуть все задачи.
     * React использует: fetch("http://localhost:8080/todos")
     */
    @GetMapping
    fun getAll(): List<TodoResponse> = service.getAll()

    /**
     * GET /todos/{id}
     * Вернуть одну задачу по ID.
     * React использует: fetch("http://localhost:8080/todos/1")
     */
    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): TodoResponse = service.getById(id)

    /**
     * POST /todos
     * Создать новую задачу.
     * Тело запроса (JSON): { "title": "Купить молоко" }
     * Возвращает: 201 Created + созданная задача
     *
     * @Valid — запускает валидацию полей CreateTodoRequest
     */
    @PostMapping
    fun create(
        @Valid @RequestBody request: CreateTodoRequest
    ): ResponseEntity<TodoResponse> {
        val created = service.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(created)
    }

    /**
     * PUT /todos/{id}
     * Полностью заменить задачу (title + completed).
     * Тело запроса: { "title": "Новое название", "completed": true }
     */
    @PutMapping("/{id}")
    fun update(
        @PathVariable id: Long,
        @Valid @RequestBody request: UpdateTodoRequest
    ): TodoResponse = service.update(id, request)

    /**
     * PATCH /todos/{id}
     * Обновить только статус выполнения.
     * Тело запроса: { "completed": true }
     * Удобно для чекбокса в React.
     */
    @PatchMapping("/{id}")
    fun patch(
        @PathVariable id: Long,
        @RequestBody request: PatchTodoRequest
    ): TodoResponse = service.patch(id, request)

    /**
     * DELETE /todos/{id}
     * Удалить задачу.
     * Возвращает: 204 No Content (тело пустое — так принято для DELETE)
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun delete(@PathVariable id: Long) = service.delete(id)

    /**
     * DELETE /todos/completed
     * Удалить все выполненные задачи сразу.
     * Возвращает: количество удалённых записей
     */
    @DeleteMapping("/completed")
    fun deleteCompleted(): Map<String, Int> {
        val count = service.deleteCompleted()
        return mapOf("deleted" to count)
    }
}
