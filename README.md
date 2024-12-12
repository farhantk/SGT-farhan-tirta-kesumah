# SGT Farhan Tirta Kesumah

Api Collection (Postman): [ApiCollection]

SQL schema: [Schema]

Sample data SQL: [sampleData]

[ApiCollection]: <https://github.com/farhantk/SGT-farhan-tirta-kesumah/blob/main/doc/SGT.postman_collection.json>

[Schema]: <https://github.com/farhantk/SGT-farhan-tirta-kesumah/blob/main/doc/schema.sql>

[sampleData]: <https://github.com/farhantk/SGT-farhan-tirta-kesumah/blob/main/doc/sample.sql>

## Installation

```bash
    git clone https://github.com/farhantk/SGT-farhan-tirta-kesumah.git
    cd SGT-farhan-tirta-kesumah
    npm install
    // configure DB in .env
    // configure SQL schema and data sample
    npm run dev 
```

# API Spec

## Get all book

Endpoint: GET /api/books

Query Parameters: 

    title (string): Filter by title (case-insensitive)
    author (string): Filter by author (case-insensitive)
    page (integer, default: 1)
    limit (integer, default: 10)

Response Body:

```json
{
    "data": [
        {
            "id": "674d3340-c523-41a8-a159-56edc3d9921b",
            "title": "1984",
            "author": "George Orwell",
            "published_year": 1949,
            "stock": 4,
            "isbn": "9780451524935",
            "available": true
        },
        {
            "id": "e9805736-fc02-4b80-bce8-92f4ed20d4ab",
            "title": "Brave New World",
            "author": "Aldous Huxley",
            "published_year": 1932,
            "stock": 4,
            "isbn": "9780060850524",
            "available": true
        }
    ],
    "pagination": {
        "total": 20,
        "page": 1,
        "limit": 2,
        "totalPages": 10
    }
}
```


## Register member

Endpoint: POST /api/members

Request Body:

```json
{
    "name": "test",
    "email": "test@gmail.com",
    "phone": "08567909964",
    "address": "Bandung"
}
```

Response Body:

```json
{
    "message": "Member registered successfully.",
    "data": {
        "id": "f5106a96-e4cc-471d-8bb4-4fab19541a7e",
        "name": "test",
        "email": "test@gmail.com",
        "phone": "08567909964",
        "address": "Bandung"
    }
}
```

## Borrow book

Endpoint: POST /api/borrowings

Headers:
-Authorization: {token}

Request Body:

```json
{
    "book_id": "674d3340-c523-41a8-a159-56edc3d9921b",
    "member_id": "f5106a96-e4cc-471d-8bb4-4fab19541a7e"
}
```

Response Body:
```json
{
    "message": "Book borrowed successfully.",
    "data": {
        "id": "30732a68-84a1-4037-bbfc-e2a9edc08d56",
        "book_id": "674d3340-c523-41a8-a159-56edc3d9921b",
        "member_id": "f5106a96-e4cc-471d-8bb4-4fab19541a7e",
        "borrow_date": "2024-12-11T17:00:00.000Z",
        "return_date": null,
        "status": "BORROWED",
        "created_at": "2024-12-12T02:47:37.489Z",
        "updated_at": "2024-12-12T02:47:37.489Z"
    }
}
```
## Return Book

Endpoint: PUT /api/borrowings/{borrow_id}/return

Response Body:
```json
{
    "message": "Book returned successfully.",
    "borrowing": {
        "id": "30732a68-84a1-4037-bbfc-e2a9edc08d56",
        "book_id": "674d3340-c523-41a8-a159-56edc3d9921b",
        "member_id": "f5106a96-e4cc-471d-8bb4-4fab19541a7e",
        "borrow_date": "2024-12-11T17:00:00.000Z",
        "return_date": "2024-12-11T17:00:00.000Z",
        "status": "RETURNED",
        "created_at": "2024-12-12T02:47:37.489Z",
        "updated_at": "2024-12-12T02:47:37.489Z"
    },
    "updatedStock": 4
}
```
## Member's borrowing history

Endpoint: GET /api/members/{member_id}/borrowings

Query Parameters: 

    status: Filter by status (BORROWED/RETURNED)
    page (integer, default: 1)
    limit (integer, default: 10)

Response Body:
```json
{
    "data": [
        {
            "id": "30732a68-84a1-4037-bbfc-e2a9edc08d56",
            "borrow_date": "2024-12-11T17:00:00.000Z",
            "return_date": "2024-12-11T17:00:00.000Z",
            "status": "RETURNED",
            "title": "1984",
            "author": "George Orwell",
            "published_year": 1949
        }
    ],
    "pagination": {
        "total": 1,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

