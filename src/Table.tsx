import { useState } from 'react';

interface ColumnInterface {
    value: string;
    text: string;
}

interface StudentInterface {
    id: number;
    name: string;
    age: number;
    class: string;
    address: string;
    [key: string]: number | string;
}



const Table = () => {
    const [students, setStudents] = useState<StudentInterface[]>([
        { id: 1, name: "Nguyen Van A", age: 15, class: "10A1", address: "Ha Noi" },
        { id: 2, name: "Tran Thi B", age: 16, class: "10A2", address: "Hai Phong" },
        { id: 3, name: "Le Van C", age: 15, class: "10A1", address: "Da Nang" },
        { id: 4, name: "Pham Thi D", age: 17, class: "11A1", address: "Ha Noi" },
        { id: 5, name: "Hoang Van E", age: 16, class: "10A3", address: "Nam Dinh" },
        { id: 6, name: "Do Thi F", age: 15, class: "10A2", address: "Thai Binh" },
        { id: 7, name: "Bui Van G", age: 17, class: "11A2", address: "Hai Duong" },
        { id: 8, name: "Vu Thi H", age: 16, class: "10A3", address: "Ha Noi" },
        { id: 9, name: "Dang Van I", age: 15, class: "10A1", address: "Bac Ninh" },
        { id: 10, name: "Ngo Thi K", age: 17, class: "11A1", address: "Ha Nam" }
    ])

    const columns: ColumnInterface[] = [{
        value: "id",
        text: "ID",
    }, 
    {
        value: "name",
        text: "Name"
    }, {
        value: "age",
        text: "Age"
    }, {
        value: "class",
        text: "Class"
    }, {
        value: "address",
        text: "Address"
    },
    {
        value: "action",
        text: "Action"
    }
    ];

    const handleDelete = (id: number) => {
        setStudents(students.filter(student => student.id !== id));
    }

    return (
        <>
            <table width='100%' cellPadding={0}  cellSpacing={0} border={1}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.value} >{column.text}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {students.map((student: StudentInterface) => (
                        <tr key={student.id}>
                            {columns.map((column) => {
                                if (column.value === "action") {
                                    return (
                                        <td key={column.value} >
                                            <button>Edit</button>
                                            <button onClick={() => handleDelete(student.id)}>Delete</button>
                                        </td>
                                    );
                                }
                                return <td key={column.value} >{student[column.value]}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default Table;
