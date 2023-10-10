import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Eye, EyeSlash } from 'react-bootstrap-icons';

export default function SiteRegistryIcon({ siteRegistry }: { siteRegistry: boolean }) {
    if (siteRegistry) {
        return (
            <Eye size='20' className='text-body' data-sr={siteRegistry} />
        )
    }
    else {
        return (
            <EyeSlash size='20' className='text-body' data-sr={siteRegistry} />
        )
    }
}

export function SiteRegistryIconButton({ siteRegistry }: { siteRegistry: boolean }) {
    const [dummySRState, setDummySRState] = useState<boolean>(siteRegistry)

    return (
        <>
            <Button variant='link' onClick={() => setDummySRState(!dummySRState)}>
                {/* For some reason need to do this ternary in here, couldn't just include <SiteRegistryIcon /> or wouldn't update on state changes 
                eg Make Selected Visible To Public */}
                {siteRegistry ?
                    <Eye size='20' className='text-body' data-sr={siteRegistry} />
                    : <EyeSlash size='20' className='text-body' data-sr={siteRegistry} />
                }
            </Button>
        </>
    )
}