import { io } from 'socket.io-client';

type BookRequest = {
    id: number;
    status: string;
    createdAt?: string;
    user?: { id: number; email: string; firstName?: string; lastName?: string; role?: string };
    book?: { id: number; name: string; status?: string; cover?: string; yearPublished?: number };
};

let tableData: BookRequest[] = [];
let socket: any;

function renderTable(rows: BookRequest[]) {
    tableData = rows;

    console.clear();
    console.log('=== BOOK REQUESTS (latest first) ===');

    console.table(
        tableData.map((r) => ({
            requestId: r.id,
            status: r.status,
            book: r.book?.name ?? '-',
            user: r.user ? `${r.user.firstName ?? ''} ${r.user.lastName ?? ''}`.trim() || r.user.email : '-',
            email: r.user?.email ?? '-',
            approvedByAdminId: r['approvedByAdminId'] ?? '-',
            approvedAt: r['approvedAt'] ?? '-',
        })),
    );
}

function prependRow(row: BookRequest) {
    tableData = [row, ...tableData];
    renderTable(tableData);
}

socket = io('http://localhost:3000/book-requests');

export function initAdminBookRequestsPage() {
    socket = io('http://localhost:3000/book-requests');

    socket.on('connect', () => {
        socket.emit('join-admin');
        socket.emit('get-book-requests');
    });

    socket.on('book-requests', (res) => {
        renderTable(res.data);
    });

    socket.on('new-book-request', (payload) => {
        prependRow(payload);
    });

    socket.on('book-request-updated', (payload) => {
        const index = tableData.findIndex((r) => r.id === payload.id);
        if (index !== -1) {
            tableData[index] = payload;
            renderTable(tableData);
        }
    });
}


export function destroyAdminBookRequestsPage() {
    socket?.disconnect();
}

socket.on('connect', () => {
    console.log('admin connected', socket.id);
    socket.emit('join-admin');
    socket.emit('join-user', 7);
    //   socket.emit('get-book-requests');
});

socket.on('joined-admin-room', () => {
    console.log('joined admins room');
});

socket.on('joined-user-room', (userId: number) => {
    console.log(`joined user-${userId} room`);
});

socket.on('new-book-request', (payload) => {
    console.log('NEW BOOK REQUEST:', payload);
    prependRow(payload);
});

socket.on('book-requests', (res: { data: BookRequest[] }) => {
    renderTable(res.data);
});
