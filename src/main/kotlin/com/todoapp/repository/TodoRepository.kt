package com.todoapp.repository

import com.todoapp.model.Todo
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Spring Data JPA автоматически реализует все методы:
 *   findAll(), findById(), save(), deleteById() и др.
 * Писать SQL вручную не нужно.
 */
@Repository
interface TodoRepository : JpaRepository<Todo, Long> {

    // Найти все завершённые / незавершённые задачи
    fun findAllByCompleted(completed: Boolean): List<Todo>

    // Поиск по части названия (без учёта регистра)
    fun findAllByTitleContainingIgnoreCase(title: String): List<Todo>
}
