import LocalForage from 'localforage';

LocalForage.config({
    driver: LocalForage.LOCALSTORAGE,
    name: 'list'
});
const KEY = 'list';

interface Service {
    all(done?: boolean): Promise<Item[]>;

    edit(id: number, item: Partial<Item>): Promise<void>;

    delete(id: number): Promise<void>;

    create(text: string): Promise<void>;
}

export interface Item {
    id: number;
    text: string;
    done: boolean;
}

class ListService implements Service {
    async all(done?: boolean): Promise<Item[]> {
        const list: Item[] = (await LocalForage.getItem<Item[]>(KEY)) || [];

        return (done === undefined) ? list : list.filter(item => item.done === done);
    }

    async delete(id: number): Promise<void> {
        const list: Item[] = await this.all();

        const index = list.findIndex(item => item.id === id);

        if (index !== -1) {
            list.splice(index, 1);
        }

        await LocalForage.setItem<Item[]>(KEY, list);
    }

    async edit(id: number, item: Partial<Item>): Promise<void> {
        const list: Item[] = await this.all();

        const foundItem = list.find(item => item.id === id);

        Object.assign(foundItem, item);

        await LocalForage.setItem<Item[]>(KEY, list);
    }

    async create(text: string): Promise<void> {
        const list: Item[] = await this.all();
        const lastInsertedID = list.length ? list[list.length - 1].id : 0;

        list.push({
            id: lastInsertedID + 1,
            text,
            done: false
        });

        await LocalForage.setItem<Item[]>(KEY, list);
    }
}

export default new ListService();