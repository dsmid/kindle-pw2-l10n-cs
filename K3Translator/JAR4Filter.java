/* JAR4Filter - Decompiled by JODE
 * Visit http://jode.sourceforge.net/
 */
import java.io.File;
import java.io.FilenameFilter;

class JAR4Filter implements FilenameFilter
{
    private String LangFrom;

    public JAR4Filter(String string)
    {
        LangFrom = string;
    }

    public boolean accept(File file, String string)
    {
        return string.endsWith(LangFrom + ".jar");
    }
}
