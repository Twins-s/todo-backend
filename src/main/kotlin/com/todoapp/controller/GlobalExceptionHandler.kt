package com.todoapp.controller

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.server.ResponseStatusException
import java.time.LocalDateTime

// Единый формат ошибки, который получит React
data class ErrorResponse(
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val status: Int,
    val error: String,
    val message: String
)

/**
 * Перехватывает исключения из всех контроллеров
 * и возвращает читаемый JSON вместо стандартного стека ошибок.
 */
@RestControllerAdvice
class GlobalExceptionHandler {

    // 404 Not Found / другие ResponseStatusException
    @ExceptionHandler(ResponseStatusException::class)
    fun handleResponseStatus(ex: ResponseStatusException): ResponseEntity<ErrorResponse> {
        val body = ErrorResponse(
            status  = ex.statusCode.value(),
            error   = ex.statusCode.toString(),
            message = ex.reason ?: ex.message
        )
        return ResponseEntity.status(ex.statusCode).body(body)
    }

    // 400 Bad Request — ошибки валидации (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(ex: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        // Собираем все сообщения об ошибках в одну строку
        val messages = ex.bindingResult.fieldErrors
            .joinToString("; ") { "${it.field}: ${it.defaultMessage}" }

        val body = ErrorResponse(
            status  = 400,
            error   = "Bad Request",
            message = messages
        )
        return ResponseEntity.badRequest().body(body)
    }

    // 500 Internal Server Error — неожиданные исключения
    @ExceptionHandler(Exception::class)
    fun handleGeneral(ex: Exception): ResponseEntity<ErrorResponse> {
        val body = ErrorResponse(
            status  = 500,
            error   = "Internal Server Error",
            message = ex.message ?: "Неизвестная ошибка"
        )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body)
    }
}
