import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function SiteRegistryIcon({siteRegistry}: {siteRegistry: boolean}) {
    if (siteRegistry) {
        return (
            <Eye size='20' className='text-body' />
        )
    }
    else {
        return (
            <EyeSlash size='20' className='text-body' />
        )
    }
}

export function SiteRegistryIconButton({siteRegistry}: {siteRegistry: boolean}) {
    const [dummySRState, setDummySRState] = useState<boolean>(siteRegistry)

    return (
        <Button variant='link' onClick={() => setDummySRState(!dummySRState)}><SiteRegistryIcon siteRegistry={dummySRState} /></Button>
    )
}