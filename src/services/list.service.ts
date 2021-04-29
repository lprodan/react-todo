interface Service {
    all(done?: boolean): Promise<Item[]>;

    edit(id: number, item: Partial<Item>): Promise<void>;

    delete(id: number): Promise<void>;

    create(text: string): Promise<void>;
}

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface Params {
    [key: string]: any;
}

export interface Item {
    id: number;
    text: string;
    done: boolean;
}

class ListService implements Service {
    private url = 'http://todo.local/api/';

    private request<T = void>(method: Method, query?: Params | string, body?: Params): Promise<T> {
        if (query) {
            query = Object.keys(query)
                .map(k => encodeURIComponent(k) + '=' + encodeURIComponent((query as any)[k]))
                .join('&');
        }

        let options: RequestInit = {
            method
        };

        if (body) {
            options.headers = {'Content-Type': 'application/json'};
            options.body = JSON.stringify(body);
        }

        return fetch(this.url + (query ? `?${query}` : ''), options)
            .then(response => response.headers.get('Content-Type') === 'application/json' ? response.json() : response.body);
    }


    all(done?: boolean): Promise<Item[]> {
        const query: any = {};

        if (done !== undefined) {
            query.done = done ? 1 : 0;
        }

        return this.request('GET', query);
    }

    delete(id: number): Promise<void> {
        return this.request('DELETE', {id});
    }

    edit(id: number, item: Partial<Item>): Promise<void> {
        return this.request('PUT', {id}, item);
    }

    create(text: string): Promise<void> {
        return this.request('POST', undefined,{text});
    }
}

export default new ListService();