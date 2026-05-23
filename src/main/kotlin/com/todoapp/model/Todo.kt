package com.todoapp.model

import jakarta.persistence.*
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size
import java.time.LocalDateTime

/**
 * JPA-сущность — одна строка в таблице todos.
 *
 * @Entity  — говорит Hibernate, что этот класс = таблица в БД
 * @Table   — явно задаём имя таблицы
 */
@Entity
@Table(name = "todos")
data class Todo(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // автоинкремент
    val id: Long = 0,

    @Column(nullable = false, length = 255)
    @field:NotBlank(message = "Название не может быть пустым")
    @field:Size(max = 255, message = "Название не может быть длиннее 255 символов")
    var title: String = "",

    @Column(nullable = false)
    var completed: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now()
) {
    // Обновляем updatedAt перед каждым сохранением изменений
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}
