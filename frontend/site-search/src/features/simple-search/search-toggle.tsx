import ToggleButton from 'react-bootstrap/ToggleButton';

interface Props {
    checked: boolean;
    onChange: Function,
    children: string
}

export default function SearchToggle({ checked, onChange, children }: Props) {

    return (
        <ToggleButton
            className="mb-2 me-3 border-2"
            type="checkbox"
            variant="outline-secondary"
            id={convertToClassName(children)}
            checked={checked}
            value="1"
            onChange={(e) => onChange(e.currentTarget.checked)}
        >
            {children}
        </ToggleButton>
    )
}

function convertToClassName(str: string): string {
    return str.replace(' ', '-').toLowerCase()
}