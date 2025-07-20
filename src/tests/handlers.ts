import { http, HttpResponse } from 'msw';

// Sample handlers for the shifts API
export const handlers = [
  // GET /api/shifts
  http.get('/api/shifts', () => {
    return HttpResponse.json([
      {
        id: 1,
        shiftStart: '2024-01-15T09:00:00.000Z',
        shiftEnd: '2024-01-15T17:00:00.000Z',
        tips: 150,
      },
      {
        id: 2,
        shiftStart: '2024-01-16T10:00:00.000Z',
        shiftEnd: '2024-01-16T18:00:00.000Z',
        tips: 200,
      },
    ]);
  }),

  // POST /api/shifts
  http.post('/api/shifts', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id: 3,
        ...body,
      },
    });
  }),

  // PUT /api/shifts/:id
  http.put('/api/shifts/:id', async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: {
        id: params.id,
        ...body,
      },
    });
  }),

  // DELETE /api/shifts/:id
  http.delete('/api/shifts/:id', () => {
    return HttpResponse.json({
      success: true,
    });
  }),
];
