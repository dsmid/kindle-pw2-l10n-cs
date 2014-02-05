/* KeybFilter - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.File;
import java.io.FilenameFilter;

class KeybFilter implements FilenameFilter
{
    public boolean accept(File file, String string)
    {
        return string.endsWith(".keyb");
    }
}
